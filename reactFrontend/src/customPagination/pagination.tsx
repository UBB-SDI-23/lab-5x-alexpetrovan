import React from 'react';
import classNames from 'classnames';
import styles from './pagination.module.scss';

export interface Props {
    page: number;
    totalPages: number;
    handlePagination: (page: number) => void;
}

export const PaginationComponent: React.FC<Props> = ({
    page,
    totalPages,
    handlePagination,
}) => {
    return (
        <div className={styles.pagination}>
            <div className={styles.paginationWrapper}>
                {page !== 1 && ( // Previous page button
                    <button
                        onClick={() => handlePagination(page - 1)}
                        type="button"
                        className={classNames([styles.pageItem, styles.sides].join(' '))}
                    >
                        &lt;
                    </button>
                )}

                <div>
                    <button // First page button
                    onClick={() => handlePagination(1)}
                    type="button"
                    className={classNames(styles.pageItem, {
                        [styles.active]: page === 1,
                    })}
                    >
                    {1}
                    </button>
                    <button // Second page button

                    onClick={() => handlePagination(2)}
                    type="button"
                    className={classNames(styles.pageItem, {
                        [styles.active]: page === 2,
                    })}
                >
                    {2}
                    </button>
                    <button // Third page button
                    onClick={() => handlePagination(3)}
                    type="button"
                    className={classNames(styles.pageItem, {
                        [styles.active]: page === 3,
                    })}
                    >
                    {3}
                    </button>
                </div>

                {page > 6 && // First set of "..."
                    <div className={styles.separator}>...</div>
                }

                {page === 5 && ( // Previous for 5
                    <button 
                    onClick={() => handlePagination(page-1)}
                    type="button"
                    className={styles.pageItem}
                    >
                    {page-1}
                    </button>
                )}


                {page>5 && page <totalPages-1 &&( // Show previous two pages for pages greater than 5
                <div>
                    <button
                    onClick={() => handlePagination(page -2)}
                    type="button"
                    className={styles.pageItem}
                    >
                    {page -2}
                    </button>
                    <button
                    onClick={() => handlePagination(page -1)}
                    type="button"
                    className={styles.pageItem}
                    >
                    {page - 1}
                    </button>
                </div>
                )}

                { ![1,2,3,totalPages-2,totalPages-1, totalPages].includes(page) && ( // Display current page
                    <button
                        onClick={() => handlePagination(page)}
                        type="button"
                        className={[styles.pageItem, styles.active].join(' ')}
                    >
                        {page}
                    </button>
                )}


                {page>2 && page <totalPages-4 &&( // Show next two pages for pages greater than 2
                <div>
                    <button
                    onClick={() => handlePagination(page + 1)}
                    type="button"
                    className={styles.pageItem}
                    >
                    {page + 1}
                    </button>
                    <button
                    onClick={() => handlePagination(page + 2)}
                    type="button"
                    className={styles.pageItem}
                    >
                    {page + 2}
                    </button>
                </div>
                )}

                
                { page === totalPages-4 &&( // Show next page for the totalPages - 4
                <button 
                onClick={() => handlePagination(page+1)}
                type="button"
                className={styles.pageItem}
                >
                {page+1}
                </button>

                
                )}
                

                

                {page < totalPages - 5 && // Second set of "..."
                    <div className={styles.separator}>...</div>
                }

                <div>
                <button // Third to last page button
                    onClick={() => handlePagination(totalPages-2)}
                    type="button"
                    className={classNames(styles.pageItem, {
                        [styles.active]: page === totalPages-2,
                    })}
                >
                    {totalPages-2}
                </button>
                <button // Second to last page button
                    onClick={() => handlePagination(totalPages - 1)}
                    type="button"
                    className={classNames(styles.pageItem, {
                        [styles.active]: page === totalPages - 1,
                    })}
                >
                    {totalPages - 1}
                </button>
                <button // Last page button
                    onClick={() => handlePagination(totalPages)}
                    type="button"
                    className={classNames(styles.pageItem, {
                        [styles.active]: page === totalPages,
                    })}
                >
                    {totalPages}
                </button>
                </div>

                {page !== totalPages && (// Next page button
                    <button
                        onClick={() => handlePagination(page + 1)}
                        type="button"
                        className={[styles.pageItem, styles.sides].join(' ')}
                    >
                        &gt;
                    </button>
                )}
            </div>
        </div>
    );
};



/*
{ {page === totalPages && totalPages > 3 && (
                    <button
                        onClick={() => handlePagination(page - 2)}
                        type="button"
                        className={styles.pageItem}
                    >
                        {page - 2}
                    </button>
                )}

                {page > 4 && (
            <div>
                <button
                onClick={() => handlePagination(page - 2)}
                type="button"
                className={styles.pageItem}
                >
                {page - 2}
                </button>
          
                <button
                onClick={() => handlePagination(page - 1)}
                type="button"
                className={styles.pageItem}
                >
                {page - 1}
                </button>
            </div>
                )}

                {page !== 1 && page !== totalPages && page !== 2 && page !== totalPages - 1 && (
                    <button
                        onClick={() => handlePagination(page)}
                        type="button"
                        className={[styles.pageItem, styles.active].join(' ')}
                    >
                        {page}
                    </button>
                )}

                {page < totalPages - 1 && (
                    <button
                        onClick={() => handlePagination(page + 1)}
                        type="button"
                        className={styles.pageItem}
                    >
                        {page + 1}
                    </button>
                )}

                {page === 1 && totalPages > 3 && (
                    <button
                        onClick={() => handlePagination(page + 2)}
                        type="button"
                        className={styles.pageItem}
                    >
                        {page + 2}
                    </button>
                )} }
*/