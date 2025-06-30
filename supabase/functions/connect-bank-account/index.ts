
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[BANK-CONNECTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Processing bank account connection");
    
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
    if (!user?.email) throw new Error("User not authenticated");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { accountNumber, routingNumber } = await req.json();
    
    if (!accountNumber || !routingNumber) {
      throw new Error("Bank account number and routing number are required");
    }

    logStep("Bank details received", { routingNumber });

    const stripe = new Stripe("sk_test_51RfghWQucmTpJKpfIEeJqydzwC74rg9er04Nj2eJp4ythP82Hx6pdaFN9XsVhCUKPPFVj49UGKGLwMlz3kV5rixp00KRRbGeQH", {
      apiVersion: "2023-10-16",
    });

    // Get barber profile
    const { data: barberProfile, error: profileError } = await supabaseClient
      .from('barber_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !barberProfile) {
      throw new Error("Barber profile not found");
    }

    logStep("Barber profile found", { barberId: barberProfile.id });

    // Create or get Stripe account
    let stripeAccountId = barberProfile.stripe_account_id;
    
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        business_type: 'individual',
      });
      stripeAccountId = account.id;
      logStep("Created new Stripe account", { accountId: stripeAccountId });
    }

    // Create external account (bank account)
    const externalAccount = await stripe.accounts.createExternalAccount(
      stripeAccountId,
      {
        external_account: {
          object: 'bank_account',
          country: 'US',
          currency: 'usd',
          account_number: accountNumber,
          routing_number: routingNumber,
        },
      }
    );

    logStep("External account created", { externalAccountId: externalAccount.id });

    // Update barber profile with bank details
    const { error: updateError } = await supabaseClient
      .from('barber_profiles')
      .update({
        bank_account_number: `****${accountNumber.slice(-4)}`, // Store masked version
        bank_routing_number: routingNumber,
        stripe_account_id: stripeAccountId,
        bank_account_verified: false, // Will be verified by Stripe
      })
      .eq('user_id', user.id);

    if (updateError) {
      logStep("Error updating barber profile", updateError);
      throw new Error("Failed to update profile with bank details");
    }

    return new Response(JSON.stringify({
      success: true,
      accountId: stripeAccountId,
      externalAccountId: externalAccount.id,
      message: "Bank account connected successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in connect-bank-account", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
