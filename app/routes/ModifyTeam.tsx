// import { useEffect, useState } from "react";
// import { IoAdd } from "react-icons/io5";
// import DarkOverlay from "~/components/Layout/DarkOverlay";
// import BasicInput from "~/components/Forms/Input/BasicInput";
// import FormHeader from "~/components/Forms/Headers/FormHeader";
// import { placeholderAvatar } from "~/utility/placeholderAvatar";
// import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
// import {
//   Form,
//   Outlet,
//   useActionData,
//   useLoaderData,
//   useNavigate,
// } from "@remix-run/react";
// import BasicSelect from "~/components/Forms/Select/BasicSelect";

// export const ModifyTeam = () => {
//   const navigate = useNavigate();

//   const { team, stores } = useLoaderData<typeof loader>();

//   const { validationErrors, success } = useActionData() as ActionReturnTypes;

//   const mode = team ? "edit" : "add";

//   const [loading, setLoading] = useState<boolean>(false);

//   // const handleRemoveUserFromTeam = (
//   //   staffId: string,
//   //   firstName?: string | null,
//   //   lastName?: string | null
//   // ) => {
//   //   const hasFullName = firstName && lastName;
//   //   ActionAlert(
//   //     "Confirm",
//   //     `Remove ${hasFullName ? firstName + " " + lastName : "User"} From Team?`,
//   //     () => {
//   //       const formData = new FormData();
//   //       formData.set("_action", "removeUser");
//   //       formData.set("staffId", staffId);
//   //       formData.set("teamId", team?.id.toString());
//   //       submit(formData, { method: "POST" });
//   //     }
//   //   );
//   // };

//   useEffect(() => {
//     if (success) {
//       navigate(-1);
//     }
//   }, [success, navigate]);

//   return (
//     <DarkOverlay>
//       <Form
//         method="POST"
//         className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
//       >
//         <FormHeader
//           valueToChange={team}
//           type="Team"
//           hasIsActive={true}
//           hasDelete={false}
//         />
//         <div className="flex flex-col gap-6">
//           <div className="flex flex-col">
//             <div className="flex justify-between gap-3">
//               <BasicInput
//                 name="firstName"
//                 label="First Name"
//                 placeholder="Name"
//                 type="text"
//                 defaultValue={team?.name || undefined}
//                 validationErrors={validationErrors}
//               />

//               <BasicInput
//                 name="lastName"
//                 label="Last Name"
//                 placeholder="Name"
//                 type="text"
//                 defaultValue={team?.name || undefined}
//                 validationErrors={validationErrors}
//               />
//             </div>
//             <div>
//               <BasicSelect
//                 label="Location"
//                 name="location"
//                 customWidth="w-full"
//                 placeholder="Select a Location"
//                 selections={stores as unknown as SelectValue[]}
//                 defaultValue={team.storeId.toString()}
//               />
//             </div>

//             <div className="flex flex-row justify-end sm:justify-start">
//               <button
//                 type="submit"
//                 className="btn btn-primary mt-6 w-max !rounded-sm"
//               >
//                 Search
//               </button>
//             </div>
//           </div>

//           {mode === "edit" && (
//             <div className="mx-auto w-full">
//               <div>
//                 <div className="mb-3 ml-[6px] text-[0.875rem]">
//                   Team Members
//                 </div>
//               </div>
//               <table className="table">
//                 <tbody>
//                   {team?.staff?.map(
//                     (
//                       { id, userDetails, avatar, jobTitle }: Staff,
//                       index: number
//                     ) => {
//                       const { firstName, lastName } = userDetails!;
//                       return (
//                         <tr
//                           key={"teamMemberTableRow_" + index}
//                           className="cursor-pointer rounded-sm transition-colors duration-300 hover:bg-base-100"
//                         >
//                           <th>{index + 1}</th>

//                           <td>
//                             <div className="flex items-center space-x-3">
//                               <div className="avatar">
//                                 <div className="mask mask-circle h-12 w-12">
//                                   <img
//                                     src={avatar?.href || placeholderAvatar.href}
//                                     alt="staff_avatar"
//                                   />
//                                 </div>
//                               </div>
//                               <div>
//                                 <div className="font-bold">
//                                   {firstName} {lastName}
//                                 </div>
//                                 <div className="text-sm opacity-50">
//                                   {jobTitle}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>

//                           <td>
//                             <IoAdd
//                               size={24}
//                               className="cursor-pointer rounded-full bg-primary p-[0.3rem] text-primary-content transition-colors duration-300 hover:bg-primary-dark"
//                               onClick={() => navigate(`/admin/staff/${id}`)}
//                             />
//                           </td>
//                         </tr>
//                       );
//                     }
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <BackSubmitButtons
//           loading={loading}
//           setLoading={setLoading}
//           validationErrors={validationErrors}
//         />
//       </Form>
//       <Outlet />
//     </DarkOverlay>
//   );
// };
