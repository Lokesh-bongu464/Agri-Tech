import React from 'react'
import { Link } from 'react-router-dom'

const Anavbar = () => {
  return (
    <div>
        <header className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Agri-Tech</h1>
          <nav>
            <Link to='/ahome' className="px-2 text-lg hover:text-green-200">Dashboard</Link>
            <Link to='/users' className="px-2 text-lg hover:text-green-200">Users</Link>
            <Link to='/getproducts' className="px-2 text-lg hover:text-green-200">Products</Link>
            <Link to='/addproduct' className="px-2 text-lg hover:text-green-200">Add Product </Link>
            <Link to='/ulogin' className="px-2 text-lg hover:text-green-200">Logout</Link>

          </nav>
        </div>
      </header>
    </div>
  )
}

export default Anavbar

