import { useEffect } from "react";
import { useState } from "react";

export default function SchoolCatalog() {
  const url = "/api/courses.json";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredItems = items.filter((course) => {
    return Object.values(course)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  let sortedItems = [...filteredItems];

  if (sortColumn !== null) {
    sortedItems.sort((a, b) => {
      const valueA = String(a[sortColumn]).toLowerCase();
      const valueB = String(b[sortColumn]).toLowerCase();

      if (valueA < valueB) {
        if (sortDirection === "asc") {
          return -1;
        } else {
          return 1;
        }
      } else if (valueA > valueB) {
        if (sortDirection === "asc") {
          return 1;
        } else {
          return -1;
        }
      } else {
        return 0;
      }
    });
  }

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const columns = [
    { label: "Trimester", key: "trimester" },
    { label: "Course Number", key: "courseNumber" },
    { label: "Course Name", key: "courseName" },
    { label: "Semester Credits", key: "semesterCredits" },
    { label: "Total Clock Hours", key: "totalClockHours" },
  ];

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(party) => setSearchTerm(party.target.value)}
      />
      <table>
        <thead>
          <tr>
            {columns.map((col) => {
              let direction = "";
              if (sortColumn === col.key) {
                if (sortDirection === "asc") {
                  direction = " asc";
                } else {
                  direction = " desc";
                }
              }
              return (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{ cursor: "pointer" }}
                >
                  {col.label}
                  {direction}
                </th>
              );
            })}
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((course, index) => (
            <tr key={index}>
              {Object.values(course).map((value, i) => (
                <td key={i}>{String(value)}</td>
              ))}
              <td>
                <button>Enroll</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
