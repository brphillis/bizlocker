type Props = {
  articleCategories: ArticleCategory[];
  defaultValue?: string;
};

const SelectArticleCategory = ({ articleCategories, defaultValue }: Props) => {
  return (
    <div className="form-control w-full sm:w-[215px]">
      <label className="label text-sm">Article Category</label>
      <select
        name="articleCategory"
        className=" select w-full text-brand-black/75"
        defaultValue={defaultValue}
      >
        <option value="">Select a Category</option>
        {articleCategories?.map(({ id, name }: Brand) => {
          return (
            <option key={"articleCategory_" + id} value={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectArticleCategory;
