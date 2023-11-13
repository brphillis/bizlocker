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
        link: "/admin/staff",
      },
      {
        name: "Teams",
        link: "/admin/teams",
      },
      {
        name: "Orders",
        link: "/admin/orders",
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
        link: "/admin/pages",
      },
      {
        name: "Articles",
        link: "/admin/articles",
      },
      {
        name: "Article Categories",
        link: "/admin/article-categories",
      },
    ],
  },

  {
    icon: "IoPeople",
    name: "User Management",
    children: [
      {
        name: "Users",
        link: "/admin/users",
      },
    ],
  },

  {
    icon: "IoLocation",
    name: "Locations",
    children: [
      {
        name: "Stores",
        link: "/admin/stores",
      },
    ],
  },

  {
    icon: "IoPricetag",
    name: "Product",
    children: [
      {
        name: "Products",
        link: "/admin/products",
      },
      {
        name: "Departments",
        link: "/admin/departments",
      },
      {
        name: "Categories",
        link: "/admin/product-categories",
      },
      {
        name: "SubCategories",
        link: "/admin/product-subcategories",
      },
      {
        name: "Brands",
        link: "/admin/brands",
      },
      {
        name: "Stock Transfers",
        link: "/admin/stock-transfers",
      },
    ],
  },

  {
    icon: "IoFolder",
    name: "Storage",
    children: [
      {
        name: "Images",
        link: "/admin/images",
      },
    ],
  },

  {
    icon: "IoFileTrayFull",
    name: "Reports",
    children: [
      {
        name: "Sales",
        link: "/admin/report-sales",
      },
    ],
  },

  {
    icon: "IoMegaphone",
    name: "Marketing",
    children: [
      {
        name: "Promotions",
        link: "/admin/promotions",
      },

      {
        name: "Campaigns",
        link: "/admin/campaigns",
      },
    ],
  },
];
