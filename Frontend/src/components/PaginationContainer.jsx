import React from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";

const PaginationContainer = () => {
  const { meta } = useLoaderData();
  let { search, pathname } = useLocation();
  const { page, pageCount } = meta.pagination;
  const navigate = useNavigate();

  const handleNavigatePage = (newPage) => {
    const searchParamsObj = new URLSearchParams(search);

    searchParamsObj.set("page", newPage);

    navigate(`${pathname}?${searchParamsObj.toString()}`);
  };

  return (
    <>
      <div className="join  flex  justify-center mt-16">
        {page != 1 && (
          <button
            className="join-item btn"
            onClick={() => {
              handleNavigatePage(page - 1 < 1 ? 1 : page - 1);
            }}
          >
            «
          </button>
        )}

        <button className="join-item btn bg-base-300">Page {page}</button>

        {page != pageCount && (
          <button
            className="join-item btn"
            onClick={() => {
              handleNavigatePage(page + 1 > pageCount ? pageCount : page + 1);
            }}
          >
            »
          </button>
        )}
      </div>
    </>
  );
};

export default PaginationContainer;
