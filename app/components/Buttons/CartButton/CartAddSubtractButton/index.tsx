// import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
// // import { upsertCartItem } from "../../../../utility/api/Cart";
// import { useRevalidator } from "react-router-dom";

// type Props = {
//   mode: "add" | "subtract";
//   variantId: string;
//   size?: number;
//   style?: string;
// };

// const CartAddSubtractButton = ({ mode, variantId, size, style }: Props) => {
//   const revalidate = useRevalidator();

//   if (mode == "add") {
//     return (
//       <IoAddCircle
//         size={size || 20}
//         className={"cursor-pointer text-white/20 " + style}
//         onClick={async () => {
//           if (variantId) {
//             await upsertCartItem(undefined, {
//               variantId: variantId.toString(),
//               quantity: "1",
//             });
//             revalidate.revalidate();
//           }
//         }}
//       />
//     );
//   } else {
//     return (
//       <IoRemoveCircle
//         size={size || 20}
//         className={"cursor-pointer text-white/20 " + style}
//         onClick={async () => {
//           if (variantId) {
//             await upsertCartItem(undefined, {
//               variantId: variantId.toString(),
//               quantity: "-1",
//             });
//             revalidate.revalidate();
//           }
//         }}
//       />
//     );
//   }
// };

// export default CartAddSubtractButton;
