import styles from './Styles.module.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    return (
      <div className="d-flex justify-content-center mt-3">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`btn btn-sm mx-1 ${page === currentPage ? "btn-primary" : "btn-outline-primary"}`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  }
  

export default Pagination;