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

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export function ConfirmDeleteDialog({ isOpen, onClose, onConfirm, productName }: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white border-l-8 border-[#da291c]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black uppercase text-gray-800">
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium text-gray-500">
            Você está prestes a remover <span className="text-black font-bold">"{productName}"</span> do inventário. 
            Esta ação é irreversível e removerá todos os dados vinculados a este item.
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
            Sim, Excluir Produto
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}