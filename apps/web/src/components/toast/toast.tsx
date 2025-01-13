"use client";
import { useState } from "react";
import toast, { ToastOptions } from "react-hot-toast";
import { ReactNode } from "react";

type AddToastOptions = {
  appearance?: AppearanceTypes;
  autoDismiss?: boolean;
};

type AddToast = (content: ReactNode, options?: AddToastOptions) => string;
type RemoveToast = (id: string) => void;
type RemoveAllToasts = () => void;
type UpdateToast = (
  id: string,
  content: ReactNode,
  options?: AddToastOptions
) => void;

type AppearanceTypes = "success" | "error" | "loading" | "blank";

interface ToastItem {
  content: ReactNode;
  id: string;
  appearance: AppearanceTypes;
}

function useToasts() {
  const [toastStack, setToastStack] = useState<Array<ToastItem>>([]);

  const addToast: AddToast = (content, options = {}) => {
  const { appearance = "blank", autoDismiss = true } = options;
  const toastOptions: ToastOptions = {
    icon: appearance,
    duration: autoDismiss ? 4000 : undefined, // Adjust duration based on autoDismiss
  };

  if (content === undefined || content === null) {
    throw new Error("Toast content cannot be undefined or null");
  }

  // Conditionally call toast based on appearance type
  const id = appearance === "success"
    ? toast.success(content as string)
    : appearance === "error"
    ? toast.error(content as string)
    : toast(content as string, toastOptions);

  setToastStack((prev) => [...prev, { content, id, appearance }]);

  return id;
};


  const removeToast: RemoveToast = (id) => {
    toast.dismiss(id);
    setToastStack((prev) => prev.filter((t) => t.id !== id));
  };

  const removeAllToasts: RemoveAllToasts = () => {
    toast.dismiss();
    setToastStack([]);
  };

  const updateToast: UpdateToast = (id, content, options = {}) => {
    const { appearance = "blank" } = options;
    toast(content as string, { id, icon: appearance });

    setToastStack((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content, appearance } : t))
    );
  };

  return {
    addToast,
    removeToast,
    removeAllToasts,
    toastStack,
    updateToast,
  };
}

export { useToasts };
