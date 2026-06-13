import React, { Component } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Img1 from '../../../assets/a.jpg';
import Img2 from '../../../assets/aa.jpg';
import Img3 from '../../../assets/aaa.jpeg';
import Img4 from '../../../assets/aaaa.jpg';

class Home extends Component {
    state = {
        selectedImage: null,
    };

    componentDidMount() {
        AOS.init({
            duration: 1200,
            once: false,
            offset: 100,
            easing: 'ease-in-out',
        });
    }

    openImage = (image) => {
        this.setState({ selectedImage: image });
    };

    closeImage = () => {
        this.setState({ selectedImage: null });
    };

    render() {
        const heroes = [
            {
                id: 1,
                title: "আমরা 2022-23 সেশন এর সবাই বন্ধু ।",
                description: "শেষ বারের মতো এক ফ্রেমে সবাই",
                image: Img1,
                reverse: true,
            },
            {
                id: 2,
                title: "আমরা ঐক্য ছাত্রাবাস পরিবার",
                description:
                    "2020-21 সেশন এর বড় ভাইদের বিদায় এবং 2023-24 সেশন এর ছোট ভাইদের নবীণ বরণ উপলক্ষে আনন্দ ভ্রমণ 18-04-2024 তারিখে- “ডাক বাংলো, আনন্দ ধারা রিসোর্ট, মহারাজা দিঘী, তেঁতুলিয়া, পঞ্চগড়।”",
                image: Img2,
                reverse: false,
            },
            {
                id: 3,
                title: "আমরা ঐক্য ছাত্রাবাস পরিবার",
                description:
                    "2022-23 সেশন এর (আমাদের) বিদায় উপলক্ষে এবং 2025-26 সেশন এর ছোট ভাইদের নবীণ বরণ আনন্দ ভ্রমণ তারিখে- 08-05-2026 - 09-05-2026 “জাফলং, শ্রীমঙ্গল, সিলেট।”",
                image: Img3,
                reverse: true,
            },
            {
                id: 4,
                title: "আমরা ঐক্য ছাত্রাবাস পরিবার",
                description:
                    "2021-22 সেশন এর বড় ভাইদের বিদায় এবং 2024-25 সেশন এর ছোট ভাইদের নবীণ বরণ উপলক্ষে আনন্দ ভ্রমণ 11-04-2025 তারিখে- “সাফিনা পার্ক, রাজশাহী ইউনিভার্সিটি, আই-বাদ, টি-বাদ, পদ্মা গার্ডেন, রাজশাহী।”",
                image: Img4,
                reverse: false,
            },
        ];

        return (
            <>
                <div className="bg-[#122920] flex flex-col items-center text-center">
                    {heroes.map((hero) => (
                        <div key={hero.id} className="hero my-6 w-full">
                            <div
                                data-aos="fade-up"
                                data-aos-delay={hero.id * 50}
                                className={`hero-content p-6 flex flex-col lg:flex-row ${hero.reverse ? 'lg:flex-row-reverse' : ''
                                    }`}
                            >
                                <img
                                    src={hero.image}
                                    alt={hero.title}
                                    onClick={() => this.openImage(hero.image)}
                                    className="w-full max-w-xl rounded-lg shadow-2xl my-4 cursor-pointer hover:scale-105 transition duration-300"
                                />

                                <div>
                                    <h1 className="text-3xl mt-6 font-bold text-green-400">
                                        {hero.title}
                                    </h1>

                                    <p className="py-6 px-4 md:mx-24 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
                                        {hero.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {this.state.selectedImage && (
                    <div
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                        onClick={this.closeImage}
                    >
                        <img
                            src={this.state.selectedImage}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <button
                            onClick={this.closeImage}
                            className="absolute top-4 right-4 text-white text-4xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                )}
            </>
        );
    }
}

export default Home;