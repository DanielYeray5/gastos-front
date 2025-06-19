import { ArrowDown, ArrowUp } from "lucide-react";

const TransactionItem = ({transaction}) => {
    const color = transaction.type === "ingreso" ? "text-emerald-600" : "text-red-600";
  return (
    <div className={`${color} display flex justify-between text-emerald-600 flex-1`}>
      <div className=" flex">
        {transaction.type == "ingreso" ? (<ArrowUp/>) : (<ArrowDown />)}
        <div className="text-white mx-3 text-start">
          <h3 className="text-xl font-bold mb-1">{transaction.description}</h3>
          <small className="text-amber-300 text-sm">{transaction.category?.name || 'Sin categoría'}</small>
        </div>
      </div>

      <div className="text-white text-end">
        <p>
          <span className={`text-2xl ${color} font-bold`}>${transaction.amount}</span>
        </p>
        <p className="text-cyan-100">{new Date(transaction.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
