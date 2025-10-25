import React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const Select = ({ value, onValueChange, children, placeholder }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <div className="relative">
      <button
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}
        onClick={() => setOpen(!open)}
      >
        <span className={value ? "" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg z-50">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onSelect: (itemValue) => {
                onValueChange(itemValue)
                setOpen(false)
              }
            })
          )}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ value, children, onSelect }) => {
  return (
    <div
      className="relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 px-3 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  )
}

export { Select, SelectItem }
