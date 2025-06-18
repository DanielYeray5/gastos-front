const NavLi = ({ setHook, children, className = "" }) => {
    return (
        <li className={className}>
            <button onClick={setHook} className='flex gap-2  hover:text-emerald-500 my-4'>
                {children}
            </button>
        </li>
    )
}

export default NavLi