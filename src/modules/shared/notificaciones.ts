// // import { DialogInterface } from '../personas/interfaces/type.interface';
// import { DialogInterface } from '../interfaces/type.interface';

// const autoClose = (
//   titleDialog: string,
//   messagedialog: string,
//   $q: DialogInterface
// ) => {
//   let seconds = 2;

//   const dialogInstance = $q.dialog({
//     title: titleDialog,
//     message: messagedialog,
//     ok: false,
//     color: 'primary',
//     position: 'bottom',
//   });

//   if (dialogInstance) {
//     dialogInstance.onDismiss(() => {
//       clearTimeout(timer);
//     });
//   }

//   const timer = setInterval(() => {
//     seconds--;

//     if (!(seconds > 0)) {
//       clearInterval(timer);
//       if (dialogInstance) {
//         dialogInstance.hide();
//       }
//     }
//   }, 1000);
// };

// // const errorDialog = (message: string, $q: DialogInterface) => {
// //   $q.dialog({
// //     color: 'teal-10',
// //     title: 'Error!',
// //     message: message,
// //     ok: {
// //       label: 'Aceptar',
// //       color: 'negative',
// //     },
// //     cancel: false,
// //     persistent: true,
// //   })
// //     .onOk(async () => {})
// //     .onOk(() => {})
// //     .onCancel(() => {})
// //     .onDismiss(() => {});
// // };

// export { autoClose };
