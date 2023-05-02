import React, { useEffect, useState } from "react";

function Activities() {
  const token = localStorage.getItem("jwt"); //store token in localStorage

  const [activities, setActivities] = useState([]);
  const [activitiesSearch, setActivitiesSearch] = useState([]);
  //
  useEffect(() => {
    fetch(`https://protracker-5hxf.onrender.com/activities`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
        setActivitiesSearch(data);
        setIsFetching(true)
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  let findActivity = () => {
    let results = activitiesSearch.filter((activity) => {
      return activity.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setActivities(results);
  };

  let activityList = activities.map((activity) => {
    return (
      <tr>
        <th
          scope="row"
          class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-solid"
        >
          {activity}
        </th>
      </tr>
    );
  });

  const [isFetching, setIsFetching] = useState(false);

  return (
    <div>
      <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        {isFetching ? (
          <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
            <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div class="w-full md:w-1/2">
                  <form class="flex items-center">
                    <label for="simple-search" class="sr-only">
                      Search
                    </label>
                    <div class="relative w-full">
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          aria-hidden="true"
                          class="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewbox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="simple-search"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Search"
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          findActivity();
                        }}
                        value={searchTerm}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-4 py-3">
                        Activity name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityList.length > 0 ? (
                      activityList
                    ) : (
                      <h1 className="no-results-msg">No activities found</h1>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="page-loader">
            <div className="p-loader">
              <div className="p-ball-1"></div>
              <div className="p-ball-2"></div>
              <div className="p-ball-3"></div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Activities;
