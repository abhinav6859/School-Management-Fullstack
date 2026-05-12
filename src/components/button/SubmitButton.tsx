"use client";

type SubmitButtonProps = {
  isSubmitting: boolean;
  type?: "create" | "update" | "delete";
  entity?: string; // teacher, student, etc.
};

const SubmitButton = ({
  isSubmitting,
  type = "create",
  entity = "Item",
}: SubmitButtonProps) => {


  
  const getText = () => {
    if (isSubmitting) return "Submitting...";

    if (type === "create") return `Create ${entity}`;
    if (type === "update") return `Update ${entity}`;
    if (type === "delete") return `Delete ${entity}`;

    return "Submit";
  };

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {isSubmitting && <span className="animate-spin">⏳</span>}
      {getText()}
    </button>
  );
};

export default SubmitButton;