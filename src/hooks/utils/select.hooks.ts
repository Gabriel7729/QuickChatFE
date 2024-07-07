import { useRef, useCallback } from "react";

export const useResetSelects = () => {
  const selectRefs = useRef<any[]>([]);

  const addSelectRef = (ref: any) => {
    if (ref && !selectRefs.current.includes(ref)) {
      selectRefs.current.push(ref);
    }
  };

  const resetAllSelects = useCallback(() => {
    selectRefs.current.forEach((selectRef) => {
      const clearButton = selectRef.querySelector(
        "button.mantine-CloseButton-root"
      );
      console.log("Clear button", clearButton)
      if (clearButton) {
        clearButton.click();
      }
    });
  }, []);

  return { addSelectRef, resetAllSelects };
};
