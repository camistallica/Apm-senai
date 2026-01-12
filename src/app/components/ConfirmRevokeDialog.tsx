import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ConfirmRevokeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export function ConfirmRevokeDialog({ isOpen, onClose, onConfirm, userName }: ConfirmRevokeDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white border-l-8 border-[#da291c]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black uppercase text-gray-800">
            Revogar Acesso
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium text-gray-500">
            Você tem certeza que deseja revogar o acesso de <span className="text-black font-bold">"{userName}"</span>? 
            Este colaborador perderá imediatamente a permissão para gerenciar o estoque.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="font-bold uppercase text-[10px] tracking-widest border-gray-200">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-[#da291c] hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest"
          >
            Confirmar Revogação
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}