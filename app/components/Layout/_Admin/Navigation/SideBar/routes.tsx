export const adminNavBarRoutes: NavigationRouteItem[] = [
  {
    icon: "IoHomeSharp",
    name: "Home",
    link: "/admin/home",
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
        link: "/admin/search/articleCategory",
      },
      {
        name: "Site Settings",
        link: "/admin/upsert/siteSettings",
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
        name: "Departments",
        link: "/admin/search/department",
      },
      {
        name: "Categories",
        link: "/admin/search/productCategory",
      },
      {
        name: "SubCategories",
        link: "/admin/search/productSubCategory",
      },
      {
        name: "Brands",
        link: "/admin/search/brand",
      },
      {
        name: "Stock Transfers",
        link: "/admin/search/stockTransfer",
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
];
