const SectList = ({ precio, texto, color, children }) => {
  return (
    <div className='w-1/6'>
      <button className='w-full shadow-lg rounded bg-slate-700 p-4 text-white flex flex-col'>
        <div className={`flex items-center gap-2 text-2xl ${color}`}>
          <span className={`${color}`}>{children}</span>
          <span>{precio}</span>
        </div>
        <p className='text-end text-slate-200'>{texto}</p>
      </button>
    </div>
  )
}

export default SectList