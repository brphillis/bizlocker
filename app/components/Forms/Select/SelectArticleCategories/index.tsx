import { useState } from "react";

type Props = {
  articleCategories: ArticleCategory[];
  valueToChange: Article;
  title?: string;
  styles?: string;
};

const SelectArticleCategories = ({
  articleCategories,
  valueToChange,
  title,
  styles,
}: Props) => {
  const [selectedArticleCategories, setSelectedArticleCategories] = useState<
    string[]
  >(valueToChange?.articleCategories?.map((e) => e?.name) || [""]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedArticleCategories(selectedOptions);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{title ? title : "Categories"}</span>
      </label>
      <select
        className={` select ${styles ? styles : "w-[95vw] sm:w-[215px]"}`}
        onChange={handleOptionChange}
        value={selectedArticleCategories}
        multiple
      >
        {articleCategories?.map(({ id, name }: ArticleCategory) => (
          <option key={id} value={name}>
            {name}
          </option>
        ))}
      </select>
      <input
        hidden
        readOnly
        name="articleCategories"
        value={JSON.stringify(selectedArticleCategories)}
      />
    </div>
  );
};

export default SelectArticleCategories;
