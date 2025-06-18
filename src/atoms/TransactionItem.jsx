import { ArrowDown, ArrowUp } from "lucide-react";

const TransactionItem = ({transaction}) => {
    const color = transaction.type === "ingreso" ? "text-emerald-600" : "text-red-600";
  return (
    <li className={`${color} display flex justify-between text-emerald-600`}>
      <div className=" flex">
        {transaction.type == "ingreso" ? (<ArrowUp/>) : (<ArrowDown />)}
        <div className="text-white mx-3 text-start">
          <h3 className="text-xl font-bold mb-1">{transaction.description}</h3>
          <small className="text-amber-300 text-sm">{transaction.categoryName}</small>
        </div>
      </div>

      <div className="text-white text-end">
        <p>
          <span className={`text-2xl ${color} font-bold`}>${transaction.amount}</span>
        </p>
        <p className="text-cyan-100">{transaction.date}</p>
      </div>
    </li>
  );
};

export default TransactionItem;
