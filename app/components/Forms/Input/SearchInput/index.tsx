import { useSearchParams, useSubmit } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  placeholder: string;
  auto?: boolean;
  delay?: number;
  action?: string;
};

const SearchInput = ({ name, placeholder, auto, delay, action }: Props) => {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const [searchTerm, setSearchTerm] = useState("");
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const handleSearch = () => {
      searchParams.set(name, searchTerm);
      submit(searchParams, {
        method: "GET",
        action: action,
      });
    };

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      handleSearch();
    }, delay || 1500);

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [searchTerm, name, searchParams, submit, delay, action]);

  return (
    <input
      name={name}
      className="input-bordered input w-[95vw] sm:w-[215px]"
      placeholder={placeholder}
      type="text"
      onChange={(e) => {
        if (auto) {
          handleChange(e);
        }
      }}
    />
  );
};

export default SearchInput;
