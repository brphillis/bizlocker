export const adminNavBarRoutes: NavigationRouteItem[] = [
  {
    icon: "IoHomeSharp",
    name: "Home",
    link: "/admin",
  },

  {
    icon: "IoBriefcase",
    name: "My Workplace",
    children: [
      {
        name: "Staff",
        link: "/admin/search/staff",
      },
      {
        name: "Teams",
        link: "/admin/search/team",
      },
      {
        name: "Departments",
        link: "/admin/search/department",
      },
      {
        name: "Orders",
        link: "/admin/search/order",
      },
    ],
  },

  {
    icon: "IoPlanet",
    name: "Website",
    children: [
      {
        name: "Home Page",
        link: "/admin/pagebuilder/homepage",
      },
      {
        name: "Pages",
        link: "/admin/search/page",
      },
      {
        name: "Articles",
        link: "/admin/search/article",
      },
      {
        name: "Article Categories",
        link: "/admin/search/article-category",
      },
    ],
  },

  {
    icon: "IoPeople",
    name: "User Management",
    children: [
      {
        name: "Users",
        link: "/admin/search/user",
      },
    ],
  },

  {
    icon: "IoLocation",
    name: "Locations",
    children: [
      {
        name: "Stores",
        link: "/admin/search/store",
      },
    ],
  },

  {
    icon: "IoPricetag",
    name: "Product",
    children: [
      {
        name: "Products",
        link: "/admin/search/product",
      },
      {
        name: "Categories",
        link: "/admin/search/product-category",
      },
      {
        name: "SubCategories",
        link: "/admin/search/product-subcategory",
      },
      {
        name: "Brands",
        link: "/admin/search/brand",
      },
      {
        name: "Stock Transfers",
        link: "/admin/search/stock-transfer",
      },
      {
        name: "Dropship",
        link: "/admin/search/dropship",
      },
    ],
  },

  {
    icon: "IoFolder",
    name: "Storage",
    children: [
      {
        name: "Images",
        link: "/admin/search/image",
      },
    ],
  },

  {
    icon: "IoFileTrayFull",
    name: "Reports",
    children: [
      {
        name: "Sales",
        link: "/admin/report/sales",
      },
    ],
  },

  {
    icon: "IoMegaphone",
    name: "Marketing",
    children: [
      {
        name: "Promotions",
        link: "/admin/search/promotion",
      },

      {
        name: "Campaigns",
        link: "/admin/search/campaign",
      },
    ],
  },

  {
    icon: "IoSettingsSharp",
    name: "Configuration",
    children: [
      {
        name: "Site Settings",
        link: "/admin/upsert/site-settings",
      },
      {
        name: "Tasks",
        link: "/admin/upsert/task",
      },
    ],
  },
];
