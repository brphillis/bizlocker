import { useNavigate } from "@remix-run/react";
import { formatDate, isValidDate } from "~/helpers/dateHelpers";
import { capitalizeAndSpace, capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  objectArray: Object[];
  currentPage?: number;
  onRowClick?: (id: string | number, index: number, name: string) => void;
  size?: "xs" | "sm" | "md" | "lg";
  mobileSize?: "xs" | "sm" | "md" | "lg";
};

const BasicTable = ({
  objectArray,
  currentPage,
  onRowClick,
  size,
  mobileSize,
}: Props) => {
  const navigate = useNavigate();

  let tableSize = "table-sm";
  switch (size) {
    case "xs":
      tableSize = "table-xs";
      break;
    case "sm":
      tableSize = "table-sm";
      break;
    case "md":
      tableSize = "table-md";
      break;
    case "lg":
      tableSize = "table-lg";
      break;
  }

  let mobileTableSize;
  switch (mobileSize) {
    case "xs":
      tableSize = "max-md:table-xs";
      break;
    case "sm":
      tableSize = "max-md:table-sm";
      break;
    case "md":
      tableSize = "max-md:table-md";
      break;
    case "lg":
      tableSize = "max-md:table-lg";
      break;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className={`table my-3 ${tableSize} ${mobileTableSize}`}>
        <thead className="sticky top-0 bg-base-300/25">
          <tr className="text-center">
            {currentPage && <th>#</th>}

            {Object.keys(objectArray[0]).map((obj: string | any, i) => {
              if (obj.toString().toLowerCase() !== "id") {
                return <th key={obj}>{capitalizeAndSpace(obj)}</th>;
              } else return null;
            })}
          </tr>
        </thead>
        <tbody>
          {objectArray?.map((obj: string | any, i) => {
            return (
              <tr
                key={"TableRow_" + obj}
                className="cursor-pointer text-center transition-colors duration-200 hover:bg-base-100"
                onClick={() => {
                  !onRowClick && obj.id
                    ? navigate(
                        `${location.pathname + "/" + obj.id}${location.search}`
                      )
                    : onRowClick && onRowClick(obj.id, i, obj.name);
                }}
              >
                {currentPage && (
                  <td className="text-center">
                    {i + 1 + (currentPage - 1) * objectArray?.length}
                  </td>
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
                      <td
                        className="text-center"
                        key={"TableValue_" + val + valIndex}
                      >
                        {formatDate(new Date(val))}
                      </td>
                    );
                  }
                  // STRING
                  if (typeof val === "string" && !isIdValue) {
                    return (
                      <td
                        className="text-center"
                        key={"TableValue_" + val + valIndex}
                      >
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
                          <div className="mx-auto block h-3 w-3 rounded-full bg-red-500" />
                        )}
                        {val && (
                          <div className="mx-auto block h-3 w-3 self-center rounded-full bg-success" />
                        )}
                      </td>
                    );
                  } else return null;
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
