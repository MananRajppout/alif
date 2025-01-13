"use client";
export const dateFormate = (dataInput: any) => {
   const d = new Date(dataInput)
   const date = d?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
   })
   return date
}
