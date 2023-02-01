import React from 'react'
import { Link } from 'react-router-dom'

const PrivateHeader = () => {
  const content = (
    <header className="dash-header">
      <div className="dash-header__container">
        <Link to='/dash'>
          <h1 className="dash-header__title">
            techNotes
          </h1>
        </Link>
        <nav className="dash-header__nav">
          {/*add nav btn*/}
        </nav>
      </div>
    </header>
  );

  return content;
}

export default PrivateHeader