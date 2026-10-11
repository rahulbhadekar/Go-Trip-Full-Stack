package com.gotrip.gotrip.config;

import com.gotrip.gotrip.entity.Tour;
import com.gotrip.gotrip.repository.TourRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import com.gotrip.gotrip.entity.User;
import com.gotrip.gotrip.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadTours(
            TourRepository tourRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            /*
             * DEVELOPMENT DATA
             *
             * Existing demo tours ko remove karke
             * corrected 12 tours insert kar rahe hain.
             *
             * IMPORTANT:
             * Production me deleteAll() use nahi karna.
             */
            // ================= ADMIN USER =================

            if (!userRepository.existsByEmail("admin@gotrip.com")) {

                User admin = new User();

                admin.setName("Go Trip Admin");
                admin.setEmail("admin@gotrip.com");
                admin.setPhone("9999999999");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole("ADMIN");

                userRepository.save(admin);

                System.out.println("==============================================");
                System.out.println("ADMIN USER CREATED SUCCESSFULLY!");
                System.out.println("Email: admin@gotrip.com");
                System.out.println("Password: Admin@123");
                System.out.println("==============================================");
            }






            tourRepository.deleteAll();


            /* =====================================================
               1. JAIPUR
               ===================================================== */

            tourRepository.save(new Tour(
                    "Royal Jaipur Escape",
                    "Jaipur",
                    "Explore forts, palaces, colourful markets and the royal heritage of Jaipur.",
                    4,
                    15999.0,
                    4.8,
                    "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85",
                    "Culture & Heritage"
            ));


            /* =====================================================
               2. GOA
               ===================================================== */

            tourRepository.save(new Tour(
                    "Goa Beach Getaway",
                    "Goa",
                    "Relax on beautiful beaches, enjoy local food and experience the vibrant side of Goa.",
                    5,
                    18999.0,
                    4.9,
                    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85",
                    "Beach & Relaxation"
            ));


            /* =====================================================
               3. MANALI
               ===================================================== */

            tourRepository.save(new Tour(
                    "Manali Mountain Adventure",
                    "Manali",
                    "Enjoy mountain views, valleys, waterfalls and exciting Himalayan experiences.",
                    6,
                    21999.0,
                    4.8,
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
                    "Adventure"
            ));


            /* =====================================================
               4. KERALA
               ===================================================== */

            tourRepository.save(new Tour(
                    "Kerala Backwater Escape",
                    "Kerala",
                    "Houseboats, tea gardens, tropical scenery and peaceful backwaters.",
                    6,
                    22999.0,
                    4.9,
                    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
                    "Relax & Recharge"
            ));


            /* =====================================================
               5. KASHMIR
               ===================================================== */

            tourRepository.save(new Tour(
                    "Magical Kashmir Journey",
                    "Srinagar",
                    "Dal Lake, shikara rides, valleys and unforgettable Himalayan mountain views.",
                    7,
                    29999.0,
                    4.9,
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Dal_Lake_srinagar_%2Ckashmir.jpg/1280px-Dal_Lake_srinagar_%2Ckashmir.jpg",
                    "Scenic Favourite"
            ));


            /* =====================================================
               6. VARANASI
               ===================================================== */

            tourRepository.save(new Tour(
                    "Spiritual Varanasi",
                    "Varanasi",
                    "Experience the Ganga Ghats, Ganga views, local culture and timeless heritage.",
                    3,
                    12999.0,
                    4.7,
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Varanasi_ganga.jpg/1280px-Varanasi_ganga.jpg",
                    "Culture & Heritage"
            ));


            /* =====================================================
               7. UDAIPUR
               ===================================================== */

            tourRepository.save(new Tour(
                    "Udaipur Royal Retreat",
                    "Udaipur",
                    "Discover beautiful lakes, royal palaces and the romantic charm of Rajasthan.",
                    4,
                    16999.0,
                    4.8,
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lake_Palace%2CUdaipur.jpg/1280px-Lake_Palace%2CUdaipur.jpg",
                    "Royal Escape"
            ));


            /* =====================================================
               8. RISHIKESH
               ===================================================== */

            tourRepository.save(new Tour(
                    "Rishikesh Adventure",
                    "Rishikesh",
                    "River rafting, mountain views, yoga and exciting adventure experiences.",
                    4,
                    13999.0,
                    4.8,
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Ganges_at_Rishikesh_from_Lakshman_Jhula.jpg/1280px-Ganges_at_Rishikesh_from_Lakshman_Jhula.jpg",
                    "Adventure"
            ));


            /* =====================================================
               9. LADAKH
               ===================================================== */

            tourRepository.save(new Tour(
                    "Ladakh Expedition",
                    "Leh",
                    "Explore high-altitude landscapes, monasteries, mountain passes and scenic roads.",
                    7,
                    34999.0,
                    4.9,
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Ladakh%2C_pangong_lake.jpg/1280px-Ladakh%2C_pangong_lake.jpg",
                    "Adventure"
            ));


            /* =====================================================
               10. DARJEELING
               ===================================================== */

            tourRepository.save(new Tour(
                    "Darjeeling Tea Escape",
                    "Darjeeling",
                    "Enjoy tea gardens, Himalayan views, peaceful hills and the famous toy train.",
                    5,
                    19999.0,
                    4.7,
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Kanchenjunga_range_from_tea_gardens_of_darjeeling.jpg/1280px-Kanchenjunga_range_from_tea_gardens_of_darjeeling.jpg",
                    "Hill Escape"
            ));


            /* =====================================================
               11. ANDAMAN
               ===================================================== */

            tourRepository.save(new Tour(
                    "Andaman Island Paradise",
                    "Andaman",
                    "Crystal-clear waters, beaches, island adventures and relaxing tropical experiences.",
                    6,
                    27999.0,
                    4.9,
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
                    "Beach & Island"
            ));


            /* =====================================================
               12. AGRA
               ===================================================== */

            tourRepository.save(new Tour(
                    "Agra Heritage Tour",
                    "Agra",
                    "Discover the Taj Mahal, Mughal heritage and the historic attractions of Agra.",
                    3,
                    10999.0,
                    4.7,
                    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85",
                    "Culture & Heritage"
            ));


            System.out.println(
                    "=============================================="
            );

            System.out.println(
                    "12 Go Trip tours added successfully!"
            );

            System.out.println(
                    "=============================================="
            );
        };
    }
}


