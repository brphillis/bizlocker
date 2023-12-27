import { useNavigate } from "@remix-run/react";
import { formatDate, isValidDate } from "~/helpers/dateHelpers";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  objectArray: Object[];
  currentPage: number;
  onRowClick?: (id: string | number) => void;
};

const BasicTable = ({ objectArray, currentPage, onRowClick }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[80vw] overflow-x-auto">
      <table className="table table-sm my-3">
        <thead className="sticky top-0">
          <tr>
            {currentPage && <th>#</th>}

            {Object.keys(objectArray[0]).map((obj: string | any, i) => {
              if (obj.toString().toLowerCase() !== "id") {
                return <th key={obj}>{capitalizeFirst(obj)}</th>;
              } else return null;
            })}
          </tr>
        </thead>
        <tbody>
          {objectArray?.map((obj: string | any, i) => {
            return (
              <tr
                key={"TableRow_" + obj}
                className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                onClick={() => {
                  !onRowClick && obj.id
                    ? navigate(
                        `${location.pathname + "/" + obj.id}${location.search}`
                      )
                    : onRowClick && onRowClick(obj.id);
                }}
              >
                {currentPage && (
                  <td>{i + 1 + (currentPage - 1) * objectArray?.length}</td>
                )}

                {Object.values(obj).map((val, valIndex: number) => {
                  const isIdValue =
                    Object.keys(obj)[valIndex].toString().toLowerCase() ===
                    "id";

                  // DATE
                  if (
                    typeof val === "string" &&
                    isValidDate(val) &&
                    !isIdValue
                  ) {
                    return (
                      <td key={"TableValue_" + val + valIndex}>
                        {formatDate(new Date(val))}
                      </td>
                    );
                  }
                  // STRING
                  if (typeof val === "string" && !isIdValue) {
                    return (
                      <td key={"TableValue_" + val + valIndex}>
                        {capitalizeFirst(val)}
                      </td>
                    );
                  }
                  // NUMBER
                  if (typeof val === "number" && !isIdValue) {
                    return <td key={"TableValue_" + val + valIndex}>{val}</td>;
                  }
                  // BOOLEAN
                  if (typeof val === "boolean" && !isIdValue) {
                    return (
                      <td key={"TableValue_" + val + valIndex}>
                        {!val && (
                          <div className="ml-3 h-3 w-3 rounded-full bg-red-500" />
                        )}
                        {val && (
                          <div className="ml-3 h-3 w-3 self-center rounded-full bg-success" />
                        )}
                      </td>
                    );
                  } else
                    return <td key={"TableValue_" + val + valIndex}>&nbsp;</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BasicTable;
