import { useEffect, useState } from 'react'
import { check_Image } from '@/libs/api'
// import 'react-lazy-load-image-component/src/effects/blur.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useRouter } from 'next/router';

export default function ImageLoader({ height, width, src, title, style, route, slide, bg, isMobile }) {

    const router = useRouter();
    const [load, setLoad] = useState(false)

    useEffect(() => {
        if (bg) {
            let el = document.getElementById(title)
            if (el)
                el.firstChild.style.background = bg
        }
    }, [])

    return (
        <>

            <LazyLoadImage
                effect="blur" // You can choose different effects here
                src={(isMobile && !load && slide) ? '/Home/slide_mob.png' : (!isMobile && !load && slide) ? '/Home/slide_web.webp' : !load ? '/empty-states.png' : check_Image(src)}
                // src={!load ? '/empty-states.png' : check_Image(src)}
                height={height}
                width={width}
                alt={title}
                className={(slide && !load) ? 'h-full w-full' : style}
                // className={(slide && !load) ? 'lg:!h-[760px] w-full md:!h-[200px] !object-fill' : style}
                onClick={() => { route ? router.push(route) : '' }}
                style={{
                    opacity: load ? 1 : 0.7,
                    // transition: 'opacity 0.5s',
                    transition: 'all 0.1s',
                    background: bg ? bg : 'transparent',
                    // mixBlendMode:'darken'
                    // width: height ? height :'100%',
                    // height:width ? width : '100%',
                    // objectFit: 'cover',
                }}
                afterLoad={() =>
                    setTimeout(() => {
                        setLoad(true)
                    }, 200)

                }
            />

        </>
    )

}