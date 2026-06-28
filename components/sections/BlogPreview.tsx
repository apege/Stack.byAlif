// 'use client';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { fadeUp, stagger, scaleIn } from '@/lib/motion';
// import { blogPosts } from '@/data';
// import { ArrowRight, Clock, Tag } from 'lucide-react';

// const categoryColors: Record<string, string> = {
//   Performance: 'text-emerald-400 bg-emerald-400/10',
//   Conversion: 'text-[#38BDF8] bg-[#38BDF8]/10',
//   Technology: 'text-[#818CF8] bg-[#818CF8]/10',
// };

// export default function BlogPreview() {
//   return (
//     <section className="section-pad">
//       <div className="max-w-[1280px] mx-auto px-6">
//         <motion.div
//           variants={stagger}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
//         >
//           <div>
//             <motion.span
//               variants={fadeUp}
//               className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3"
//             >
//               Insights
//             </motion.span>
//             <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight">
//               From the{' '}
//               <span className="gradient-text">Blog</span>
//             </motion.h2>
//           </div>
//           <motion.div variants={fadeUp}>
//             <Link
//               href="/blog"
//               className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
//             >
//               All articles <ArrowRight className="w-4 h-4" />
//             </Link>
//           </motion.div>
//         </motion.div>

//         <motion.div
//           variants={stagger}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           className="grid md:grid-cols-3 gap-5"
//         >
//           {blogPosts.map((post, i) => (
//             <motion.article
//               key={post.slug}
//               variants={scaleIn}
//               className="group glass rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 flex flex-col"
//             >
//               {/* Thumbnail placeholder */}
//               <div className="h-40 bg-gradient-to-br from-[#111827] to-[#1E293B] relative overflow-hidden">
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-5xl opacity-20">
//                     {['⚡', '📈', '⚙️'][i]}
//                   </span>
//                 </div>
//                 <div className="absolute top-4 left-4">
//                   <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'text-[#94A3B8] bg-white/10'}`}>
//                     {post.category}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-5 flex flex-col flex-1">
//                 <div className="flex items-center gap-3 text-xs text-[#94A3B8] mb-3">
//                   <span className="flex items-center gap-1">
//                     <Clock className="w-3 h-3" /> {post.readTime}
//                   </span>
//                   <span>·</span>
//                   <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
//                 </div>

//                 <Link href={`/blog/${post.slug}`}>
//                   <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-[#38BDF8] transition-colors line-clamp-2">
//                     {post.title}
//                   </h3>
//                 </Link>

//                 <p className="text-[#94A3B8] text-xs leading-relaxed flex-1 line-clamp-3">
//                   {post.excerpt}
//                 </p>

//                 <Link
//                   href={`/blog/${post.slug}`}
//                   className="mt-4 text-xs font-semibold text-[#38BDF8] hover:gap-2 flex items-center gap-1 transition-all"
//                 >
//                   Read Article <ArrowRight className="w-3 h-3" />
//                 </Link>
//               </div>
//             </motion.article>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// }
