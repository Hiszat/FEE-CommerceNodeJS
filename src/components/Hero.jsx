import hero from '../assets/img/hero.jpg'
import banner from '../assets/img/banner.jpg'

const Hero = () => {
    return ( 
        <div className='bg-yellow-900 h-[90vh] w-full overflow-y-hidden'>
            <div className='absolute w-full '>
                <img src={hero} alt="Gambar" className='object-cover w-full aspect-square h-[90vh] blur-[2px]' />
            </div>
            <div className='flex relative items-center pt-20 px-20'>
                <div className='w-1/2 px-4'>
                    <h1 className='hero'>Resto</h1>
                    <p className='text-secondary font-normal text-lg'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus mollitia culpa rem ipsa esse expedita explicabo ipsum. Quam itaque eos vitae ipsa. Molestias architecto, eveniet dolorem magni corporis similique earum!</p>
                    <button className='bg-secondary px-10 py-2 rounded-[23px] mt-5 hover:bg-opacity-75 active:bg-opacity-60'>Belanja</button>
                </div>
                <div className='w-1/2 px-4'>
                    <img src={banner} alt="" className='object-cover w-[500px]' />
                </div>
            </div>
        </div>
     );
}
 
export default Hero;