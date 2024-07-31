import Image from 'next/image';
// import dynamic from 'next/dynamic'
import Link from 'next/link'

// const CategoryTabs = dynamic(() => import("@/components/Common/CategoryTabs"));

export default function ViewAll({ data, viewAll, categoryTab, categories, filterData, navigationLink }) {
    {
        return (
            <>
                <div className="flex items-center mb-[10px] justify-between">
                    {/* <h6 className={`text-[12px] font-medium text-center primary_color`}>{data.title}</h6> */}
                    <h2 className="text-left text-[17px] font-bold">{data.title ? data.title : data.section_name}</h2>
                    
                    {viewAll &&

                    <Link href={navigationLink ? navigationLink : '#'} className='flex items-center gap-[8px] cursor-pointer'>
                        <h6 className='text-[12px] text-[#000]'>View All</h6>
                        <Image style={{ objectFit: 'contain' }} className='h-[8px] w-[12px]' height={25}  width={25} alt='vantage' src={'/Arrow/arrowBlack.svg'}></Image>
                    </Link>
                      
                    //   <button
                    //     className={`md:text-[14px] md:font-semibold md:px-[10px]
                    //     lg:border lg:rounded-[5px] lg:py-[2px] lg:px-[7px] lg:text-[14px] lg:text-medium
                    //     primary_btn`}
                    //     >View All</button>
                        
                    }

                    {/* {categoryTab && 
                        <CategoryTabs data={categories} filterData={(data)=> filterData(data)} /> 
                    } */}

                </div>
            </>
        )

    }
}
