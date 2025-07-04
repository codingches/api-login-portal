
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REAL-TIME-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Processing real-time payment request");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { bookingId, amount, paymentMethodId } = await req.json();
    
    if (!bookingId || !amount || !paymentMethodId) {
      throw new Error("Missing required payment parameters");
    }

    logStep("Payment parameters received", { bookingId, amount, paymentMethodId });

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('*, barber_profiles!inner(*)')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    // Verify user owns this booking
    if (booking.user_id !== user.id) {
      throw new Error("Unauthorized - booking does not belong to user");
    }

    logStep("Booking found and verified", { barberId: booking.barber_id, userId: user.id });

    const stripe = new Stripe("sk_test_51RfghWQucmTpJKpfIEeJqydzwC74rg9er04Nj2eJp4ythP82Hx6pdaFN9XsVhCUKPPFVj49UGKGLwMlz3kV5rixp00KRRbGeQH", {
      apiVersion: "2023-10-16",
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'automatic',
      confirm: true,
      return_url: `${req.headers.get("origin")}/dashboard`,
      metadata: {
        booking_id: bookingId,
        user_id: user.id,
        barber_id: booking.barber_id,
      },
    });

    logStep("Payment intent created", { 
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status 
    });

    // Record payment in database
    const { data: payment, error: paymentError } = await supabaseClient
      .from('real_time_payments')
      .insert({
        user_id: user.id,
        barber_id: booking.barber_id,
        booking_id: bookingId,
        amount: amount,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
        payment_method: 'stripe',
        stripe_payment_intent_id: paymentIntent.id,
        processed_at: paymentIntent.status === 'succeeded' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (paymentError) {
      logStep("Error recording payment", paymentError);
      throw new Error("Failed to record payment");
    }

    // Update booking status if payment succeeded
    if (paymentIntent.status === 'succeeded') {
      await supabaseClient
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', bookingId);

      logStep("Booking status updated to completed");
    }

    return new Response(JSON.stringify({
      success: true,
      paymentId: payment.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-real-time-payment", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
