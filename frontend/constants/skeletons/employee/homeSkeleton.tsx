// // src/components/skeletons/HomeSkeleton.tsx
// import React from 'react';
// import { Dimensions } from 'react-native';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width } = Dimensions.get('window');

// export default function HomeSkeleton() {
//   return (
//     <SkeletonPlaceholder
//       backgroundColor="#E1E9EE"
//       highlightColor="#F2F8FC"
//       speed={1200}
//     >
//       {/* 🔹 Barra de búsqueda */}
//       <SkeletonPlaceholder.Item
//         marginTop={20}
//         marginHorizontal={16}
//         width={width - 32}
//         height={40}
//         borderRadius={12}
//       />

//       {/* 🔹 Banner principal */}
//       <SkeletonPlaceholder.Item
//         marginTop={20}
//         marginHorizontal={16}
//         width={width - 32}
//         height={120}
//         borderRadius={12}
//       />

//       {/* 🔹 Sección: Según tus intereses */}
//       <SkeletonPlaceholder.Item marginTop={30} marginLeft={16}>
//         <SkeletonPlaceholder.Item width={180} height={20} borderRadius={4} />
//       </SkeletonPlaceholder.Item>

//       <SkeletonPlaceholder.Item
//         flexDirection="row"
//         marginTop={16}
//         marginLeft={16}
//       >
//         {[...Array(3)].map((_, index) => (
//           <SkeletonPlaceholder.Item key={index} marginRight={16}>
//             <SkeletonPlaceholder.Item width={100} height={100} borderRadius={12} />
//             <SkeletonPlaceholder.Item
//               width={100}
//               height={15}
//               borderRadius={4}
//               marginTop={8}
//             />
//             <SkeletonPlaceholder.Item
//               width={80}
//               height={15}
//               borderRadius={4}
//               marginTop={6}
//             />
//           </SkeletonPlaceholder.Item>
//         ))}
//       </SkeletonPlaceholder.Item>

//       {/* 🔹 Sección: Cerca de tu zona */}
//       <SkeletonPlaceholder.Item marginTop={30} marginLeft={16}>
//         <SkeletonPlaceholder.Item width={160} height={20} borderRadius={4} />
//       </SkeletonPlaceholder.Item>

//       <SkeletonPlaceholder.Item
//         flexDirection="row"
//         marginTop={16}
//         marginLeft={16}
//       >
//         {[...Array(3)].map((_, index) => (
//           <SkeletonPlaceholder.Item key={index} marginRight={16}>
//             <SkeletonPlaceholder.Item width={100} height={100} borderRadius={12} />
//             <SkeletonPlaceholder.Item
//               width={100}
//               height={15}
//               borderRadius={4}
//               marginTop={8}
//             />
//           </SkeletonPlaceholder.Item>
//         ))}
//       </SkeletonPlaceholder.Item>
//     </SkeletonPlaceholder>
//   );
// }
