
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";

interface DeleteAccountDialogProps {
  onAccountDeleted: () => void;
}

export const DeleteAccountDialog = ({ onAccountDeleted }: DeleteAccountDialogProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type 'DELETE' to confirm",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No user found");
      }

      // Call the delete account function
      const { data, error } = await supabase.rpc('delete_user_account', {
        user_id_to_delete: user.id
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        });
        onAccountDeleted();
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error: any) {
      console.error('Delete account error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black border-red-500/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">Delete Account</AlertDialogTitle>
          <AlertDialogDescription className="text-green-300/80">
            This action cannot be undone. This will permanently delete your account
            and remove all your data from our servers, including:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your profile and business information</li>
              <li>All bookings and appointments</li>
              <li>Payment history and records</li>
              <li>Messages and reviews</li>
              <li>All uploaded images</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-delete" className="text-green-300">
            Type "DELETE" to confirm:
          </Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="bg-black border-red-500/30 text-green-400"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-green-500/30 text-green-400">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={isDeleting || confirmText !== "DELETE"}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
