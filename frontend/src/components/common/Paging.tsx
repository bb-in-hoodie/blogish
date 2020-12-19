import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

interface PagingProps<T> {
  data: T[],
  sizeOfPage: number,
  widthOfPaging: number,
  onPageSelected: (elements: T[]) => void
}

export default function Paging<T>({
  data, sizeOfPage, widthOfPaging, onPageSelected,
}: PagingProps<T>): JSX.Element {
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // starts from 1 (0: not selected)
  const pageCount = useRef(0);
  const leftmostPage = useRef(0);

  // update pages with a new leftmost page
  const slidePagesToLeftmostPage = useCallback((nextLeftmostPage: number) => {
    const nextPages = [];
    const rightmostPage = Math.min(pageCount.current, nextLeftmostPage + widthOfPaging - 1);

    for (let i = nextLeftmostPage; i <= rightmostPage; i += 1) {
      nextPages.push(i);
    }
    setPages(nextPages);
    leftmostPage.current = nextLeftmostPage;
  }, [widthOfPaging]);

  // click event handlers
  const onPageClicked = useCallback((nextPage: number) => {
    if (nextPage <= 0 || nextPage > pageCount.current) {
      return;
    }

    // update currentPage
    setCurrentPage(nextPage);

    // update pages
    if (nextPage < leftmostPage.current) {
      slidePagesToLeftmostPage(nextPage - widthOfPaging + 1);
    } else if (nextPage >= leftmostPage.current + widthOfPaging) {
      slidePagesToLeftmostPage(nextPage);
    }

    // trigger callback function
    const firstIndex = (nextPage - 1) * sizeOfPage;
    const elementsInPage = data.slice(firstIndex, firstIndex + sizeOfPage);
    onPageSelected(elementsInPage);
  }, [
    setCurrentPage,
    widthOfPaging,
    sizeOfPage,
    data,
    onPageSelected,
    slidePagesToLeftmostPage,
  ]);

  // initialize
  useEffect(() => {
    if (data.length <= 0 || sizeOfPage <= 0) {
      return;
    }

    // count the total number of pages (return if pageCount is 0)
    pageCount.current = Math.ceil(data.length / sizeOfPage);
    if (pageCount.current === 0) {
      setCurrentPage(0);
      setPages([]);
      return;
    }

    // starts with the first page
    slidePagesToLeftmostPage(1);
    onPageClicked(1);
  }, [data, sizeOfPage, setCurrentPage, slidePagesToLeftmostPage, onPageClicked]);

  return (
    <nav>
      <button type="button" onClick={() => onPageClicked(currentPage - 1)}>{'<'}</button>
      {pages.map((page) => (
        <button key={page} type="button" onClick={() => onPageClicked(page)}>
          {page}
        </button>
      ))}
      <button type="button" onClick={() => onPageClicked(currentPage + 1)}>{'>'}</button>
    </nav>
  );
}
