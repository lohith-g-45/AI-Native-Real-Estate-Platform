--
-- PostgreSQL database dump
--

\restrict CwoqcNGfVeqI66lhLvm17PUPFsct9eZd51dz6euYwI1edeajexuOPQyhAe2PxeI

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.audit_logs VALUES ('e2305f35-0ab8-44de-b6af-1439ecbd82d4', 'CONSENT_GRANTED', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"category": "ai_usage", "required": false}', NULL, NULL, '2026-07-31 23:09:12.955453');
INSERT INTO public.audit_logs VALUES ('c0097a76-1aa3-484f-973d-770c6e0a6875', 'CONSENT_GRANTED', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"category": "verification_processing", "required": true}', NULL, NULL, '2026-07-31 23:09:13.034681');
INSERT INTO public.audit_logs VALUES ('f04bc917-a4bd-48ba-9fac-a47803239000', 'CONSENT_GRANTED', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"category": "document_sharing", "required": false}', NULL, NULL, '2026-07-31 23:09:13.075163');
INSERT INTO public.audit_logs VALUES ('ca507809-ee48-4ed3-8ee6-cf7b14bcd4c7', 'CONSENT_GRANTED', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"category": "communications", "required": false}', NULL, NULL, '2026-07-31 23:09:13.077301');
INSERT INTO public.audit_logs VALUES ('f6bbf93c-ab8d-4761-b5b6-d1293ccd9ea0', 'GOOGLE_ACCOUNT_CREATED', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"googleId": "102053496845493751397"}', NULL, NULL, '2026-07-31 23:09:13.086377');
INSERT INTO public.audit_logs VALUES ('f4bd798a-2a3b-4f0b-83c8-420f3106c613', 'GOOGLE_LOGIN', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"googleId": "102053496845493751397"}', NULL, NULL, '2026-08-01 10:06:53.460903');
INSERT INTO public.audit_logs VALUES ('df85925c-a063-40c9-a219-0b7e79512dd9', 'CONSENT_GRANTED', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'tualasikalaimaha@gmail.com', '{"category": "ai_usage", "required": false}', NULL, NULL, '2026-08-01 11:26:27.621851');
INSERT INTO public.audit_logs VALUES ('f564876a-cffe-4dbd-acca-45d59fb5a9a8', 'CONSENT_GRANTED', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'tualasikalaimaha@gmail.com', '{"category": "verification_processing", "required": true}', NULL, NULL, '2026-08-01 11:26:27.760254');
INSERT INTO public.audit_logs VALUES ('58f49208-3a02-4866-b42e-ff44c43d91dd', 'CONSENT_GRANTED', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'tualasikalaimaha@gmail.com', '{"category": "document_sharing", "required": false}', NULL, NULL, '2026-08-01 11:26:27.82471');
INSERT INTO public.audit_logs VALUES ('22cd62ae-aa4a-474c-a177-bdee41bb4158', 'GOOGLE_ACCOUNT_CREATED', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'tualasikalaimaha@gmail.com', '{"googleId": "114721531082681087202"}', NULL, NULL, '2026-08-01 11:26:27.825298');
INSERT INTO public.audit_logs VALUES ('30051559-e4a1-4aeb-adb1-2d8c6f7f6d5d', 'CONSENT_GRANTED', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'tualasikalaimaha@gmail.com', '{"category": "communications", "required": false}', NULL, NULL, '2026-08-01 11:26:27.861379');
INSERT INTO public.audit_logs VALUES ('fb561a99-9596-466c-875d-e3895ccd764e', 'GOOGLE_LOGIN', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"googleId": "102053496845493751397"}', NULL, NULL, '2026-08-01 11:26:49.31343');
INSERT INTO public.audit_logs VALUES ('918d5e49-cc9d-4805-bd3e-8ed0899c1b72', 'GOOGLE_LOGIN', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"googleId": "102053496845493751397"}', NULL, NULL, '2026-08-01 12:42:30.340827');
INSERT INTO public.audit_logs VALUES ('8316aaa7-6b19-4b35-99ba-98aa1101971c', 'GOOGLE_LOGIN', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"googleId": "102053496845493751397"}', NULL, NULL, '2026-08-01 14:04:08.288823');
INSERT INTO public.audit_logs VALUES ('1599b7b3-719c-40d5-9c91-dfc9b182abb0', 'GOOGLE_LOGIN', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'tualasikalaimaha@gmail.com', '{"googleId": "114721531082681087202"}', NULL, NULL, '2026-08-01 15:55:19.408792');
INSERT INTO public.audit_logs VALUES ('822262e0-508b-4a01-8aed-05e93651c45c', 'GOOGLE_LOGIN', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"googleId": "102053496845493751397"}', NULL, NULL, '2026-08-01 15:56:34.371524');
INSERT INTO public.audit_logs VALUES ('2d210042-7491-4eff-aa52-cf2cb8210a39', 'CONSENT_GRANTED', '2c1a22d3-aae1-47e1-b449-8c37aa342db1', '1582637683454501@facebook-user.local', '{"category": "ai_usage", "required": false}', NULL, NULL, '2026-08-01 16:00:29.903683');
INSERT INTO public.audit_logs VALUES ('1b92e222-e3ef-4930-8f1f-68ff281e2084', 'CONSENT_GRANTED', '2c1a22d3-aae1-47e1-b449-8c37aa342db1', '1582637683454501@facebook-user.local', '{"category": "communications", "required": false}', NULL, NULL, '2026-08-01 16:00:30.064588');
INSERT INTO public.audit_logs VALUES ('5cd62ae6-e09e-482a-9cac-4f4a2829bb19', 'CONSENT_GRANTED', '2c1a22d3-aae1-47e1-b449-8c37aa342db1', '1582637683454501@facebook-user.local', '{"category": "verification_processing", "required": true}', NULL, NULL, '2026-08-01 16:00:30.090261');
INSERT INTO public.audit_logs VALUES ('79ec9371-3ba7-48b4-96e3-ef080e35924e', 'FACEBOOK_ACCOUNT_CREATED', '2c1a22d3-aae1-47e1-b449-8c37aa342db1', '1582637683454501@facebook-user.local', '{"facebookId": "1582637683454501"}', NULL, NULL, '2026-08-01 16:00:30.097228');
INSERT INTO public.audit_logs VALUES ('939026fc-8a9c-4098-b487-a3f5b9b0e97d', 'CONSENT_GRANTED', '2c1a22d3-aae1-47e1-b449-8c37aa342db1', '1582637683454501@facebook-user.local', '{"category": "document_sharing", "required": false}', NULL, NULL, '2026-08-01 16:00:30.126442');
INSERT INTO public.audit_logs VALUES ('6ba0f145-8745-4b37-8f66-f49957938e15', 'USER_LOGIN', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"method": "otp"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', '2026-08-01 16:02:12.88551');
INSERT INTO public.audit_logs VALUES ('bb27caac-a85b-429c-90a7-1be46e1b50c9', 'GOOGLE_LOGIN', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"googleId": "102053496845493751397"}', NULL, NULL, '2026-08-01 16:19:43.261759');
INSERT INTO public.audit_logs VALUES ('419df3cf-e11d-40f4-85b1-6341ae6eff0c', 'GOOGLE_LOGIN', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"googleId": "102053496845493751397"}', NULL, NULL, '2026-08-01 16:45:54.410855');
INSERT INTO public.audit_logs VALUES ('049dec5d-ac48-4c42-b75c-1155a6e944f6', 'GOOGLE_LOGIN', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', '{"googleId": "102053496845493751397"}', NULL, NULL, '2026-08-01 18:45:15.995182');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('c266f73f-de2f-4460-9471-69421bd4dc3b', 'tualasikalaimaha@gmail.com', NULL, '114721531082681087202', NULL, NULL, 'buyer', 'tualasikalai Maha', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocKsV-V4Y1JgVpdjQMYxsglDCPNOdoCdbny_Ha0AWTsjCuQE-g=s96-c', NULL, NULL, NULL, true, NULL, NULL, false, true, NULL, NULL, NULL, NULL, '2026-08-01 11:26:27.556712', '2026-08-01 11:26:27.556712');
INSERT INTO public.users VALUES ('2c1a22d3-aae1-47e1-b449-8c37aa342db1', '1582637683454501@facebook-user.local', NULL, NULL, '1582637683454501', NULL, 'buyer', 'Lohith G', '7483652149', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1582637683454501&height=200&width=200&ext=1788172229&hash=Afs9uosCslSMm6h95CUrJsrC', '2005-02-15', '', '', true, NULL, NULL, false, true, NULL, NULL, NULL, NULL, '2026-08-01 16:00:29.862082', '2026-08-01 16:01:10.604631');
INSERT INTO public.users VALUES ('4f46358d-4157-42ac-8f69-27bf302cf4b3', 'lg8717429@gmail.com', NULL, '102053496845493751397', NULL, NULL, 'buyer', 'LOHITH G', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocImoThzTgMvYTxgUXxL_rgYF6jZXJaEj9JVtUqq-mgRV6v6lmQ=s96-c', NULL, NULL, NULL, true, NULL, NULL, false, true, '548471', '2026-08-01 16:06:50.448', NULL, NULL, '2026-07-31 23:09:12.900973', '2026-08-01 16:01:50.451585');


--
-- Data for Name: consents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.consents VALUES ('ae0b0373-5484-42cf-baf8-5de2a49f3882', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'ai_usage', true, false, '2026-07-31 23:09:12.928381', '2026-07-31 23:09:12.928381');
INSERT INTO public.consents VALUES ('62cd2720-dd0d-447d-99d7-3c1f2ec52f64', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'verification_processing', true, true, '2026-07-31 23:09:12.928381', '2026-07-31 23:09:12.928381');
INSERT INTO public.consents VALUES ('0cca9f90-824b-4e0d-b904-a0d1892fede7', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'communications', true, false, '2026-07-31 23:09:12.928381', '2026-07-31 23:09:12.928381');
INSERT INTO public.consents VALUES ('b571f5da-dde8-44bc-8018-2b2fde1c5586', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'document_sharing', true, false, '2026-07-31 23:09:12.928381', '2026-07-31 23:09:12.928381');
INSERT INTO public.consents VALUES ('55a112b6-412e-4dfa-8a60-b30c69e8c8ff', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'ai_usage', true, false, '2026-08-01 11:26:27.583272', '2026-08-01 11:26:27.583272');
INSERT INTO public.consents VALUES ('9a753b5c-6a46-4561-8b9a-41124fd9e6df', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'verification_processing', true, true, '2026-08-01 11:26:27.583272', '2026-08-01 11:26:27.583272');
INSERT INTO public.consents VALUES ('8c48853a-a8f3-4a91-9991-19b3f47abb95', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'communications', true, false, '2026-08-01 11:26:27.583272', '2026-08-01 11:26:27.583272');
INSERT INTO public.consents VALUES ('b77361fe-40f2-4c61-9d02-115d3f393293', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'document_sharing', true, false, '2026-08-01 11:26:27.583272', '2026-08-01 11:26:27.583272');
INSERT INTO public.consents VALUES ('8ec4055b-96a8-48a9-a4a4-fe82fb6cbd88', '2c1a22d3-aae1-47e1-b449-8c37aa342db1', 'ai_usage', true, false, '2026-08-01 16:00:29.879873', '2026-08-01 16:00:29.879873');
INSERT INTO public.consents VALUES ('77e47a94-c1ed-4f58-bb3b-233829fbb5aa', '2c1a22d3-aae1-47e1-b449-8c37aa342db1', 'verification_processing', true, true, '2026-08-01 16:00:29.879873', '2026-08-01 16:00:29.879873');
INSERT INTO public.consents VALUES ('5b640ae9-5137-45db-aaf1-c5512dec5a77', '2c1a22d3-aae1-47e1-b449-8c37aa342db1', 'communications', true, false, '2026-08-01 16:00:29.879873', '2026-08-01 16:00:29.879873');
INSERT INTO public.consents VALUES ('0f83fe29-a142-455e-92f1-cfce5c9a3d29', '2c1a22d3-aae1-47e1-b449-8c37aa342db1', 'document_sharing', true, false, '2026-08-01 16:00:29.879873', '2026-08-01 16:00:29.879873');


--
-- Data for Name: property_listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.property_listings VALUES ('e0151e13-ae73-492a-b218-c8ebaa481ce5', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'published', 70, '2026-08-01 10:41:07.742404', '2026-08-01 10:56:06.644031');
INSERT INTO public.property_listings VALUES ('6ed43286-905f-44da-9fad-cc3904c708da', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'published', 70, '2026-08-01 14:15:17.330474', '2026-08-01 14:27:57.620107');
INSERT INTO public.property_listings VALUES ('45660de5-7004-4084-9b70-65365be2b5f6', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'published', 70, '2026-08-01 16:03:04.76251', '2026-08-01 16:06:40.323113');
INSERT INTO public.property_listings VALUES ('4b2203e3-7f31-4906-b5f9-858d4375a975', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'published', 70, '2026-08-01 18:45:49.268657', '2026-08-01 18:53:49.340966');
INSERT INTO public.property_listings VALUES ('d5b7f9d6-f52e-43e3-9058-584547e937fd', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'draft', 0, '2026-08-01 18:57:39.241962', '2026-08-01 18:57:39.241962');


--
-- Data for Name: inquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: listing_ai_review; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: listing_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: listing_basic_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.listing_basic_details VALUES ('e0151e13-ae73-492a-b218-c8ebaa481ce5', 'for_sale', 'commercial', 'Townhouse', 'Spacious Toronto Townhouse', 950000.00, 'CAD', false, NULL, 'This stunning Toronto townhouse offers the perfect blend of luxury and comfort, boasting ample living space and impeccable design elements throughout. With its prime location and exceptional amenities, this property is a rare gem in the heart of the city, perfect for discerning buyers seeking a unique and upscale living experience. The spacious layout and abundance of natural light create a warm and inviting atmosphere, making it an ideal haven for entertaining and everyday living. Priced at 950000, this incredible townhouse presents a rare opportunity to own a piece of Toronto''s vibrant real estate market.');
INSERT INTO public.listing_basic_details VALUES ('6ed43286-905f-44da-9fad-cc3904c708da', 'for_sale', 'residential', 'Condo', 'Modern Downtown Condo', 960000.00, 'CAD', false, NULL, 'This stunning modern downtown condo offers the ultimate urban living experience, with sleek finishes, expansive windows, and breathtaking city views. Located in the heart of the city, this luxurious residence is just steps from world-class dining, entertainment, and culture. With its sophisticated design and premium amenities, this condo is the epitome of downtown living, perfect for those seeking a vibrant and cosmopolitan lifestyle. Priced at $960,000, this incredible opportunity awaits the discerning buyer seeking a truly exceptional home.');
INSERT INTO public.listing_basic_details VALUES ('45660de5-7004-4084-9b70-65365be2b5f6', 'for_sale', 'residential', 'House', 'Luxury Detached Family Home', 1580000.00, 'CAD', false, NULL, 'This stunning luxury detached family home offers the ultimate in sophisticated living, boasting an exquisite blend of elegant design, premium finishes, and expansive living spaces. With its impressive facade and beautifully manicured grounds, this magnificent property is sure to impress even the most discerning buyers. Inside, you''ll discover a world of luxury and comfort, with lavish amenities and thoughtful touches that cater to every need, making it the perfect haven for families and entertainers alike. Priced at 1,580,000, this extraordinary residence represents a rare opportunity to own a truly exceptional home.');
INSERT INTO public.listing_basic_details VALUES ('4b2203e3-7f31-4906-b5f9-858d4375a975', 'for_sale', 'commercial', 'Apartment', 'Modern detached Apartment', 290000.00, 'CAD', false, NULL, 'This stunning modern detached apartment offers the perfect blend of style, comfort, and freedom, with a unique and spacious living experience that is sure to impress. The property boasts an array of sleek and sophisticated features, from its sleek lines and minimalist aesthetic to its cutting-edge amenities and finishes. With its private and secluded setting, this exceptional home is ideal for those seeking a peaceful retreat from the hustle and bustle of city life. Its beautiful design and desirable location make it a rare and exciting opportunity for discerning buyers.');
INSERT INTO public.listing_basic_details VALUES ('d5b7f9d6-f52e-43e3-9058-584547e937fd', 'for_sale', 'residential', 'single_family', 'Draft Listing', 0.00, 'CAD', false, NULL, '');


--
-- Data for Name: listing_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.listing_details VALUES ('4b2203e3-7f31-4906-b5f9-858d4375a975', 3, 2, NULL, 2058.00, NULL, 2002, NULL, 'Finished', NULL, NULL, '{"fireplace": true}', '{"pool": true, "garage": true, "backyard": true, "parking_spaces": 1}', '{"cooling": "Central Air", "heating": "Forced Air"}', NULL);
INSERT INTO public.listing_details VALUES ('e0151e13-ae73-492a-b218-c8ebaa481ce5', 3, 2, NULL, 3040.00, NULL, 1998, NULL, 'Finished', NULL, NULL, '{"fireplace": false}', '{"pool": false, "garage": true, "backyard": true, "parking_spaces": 1}', '{"cooling": "Central Air", "heating": "Forced Air"}', NULL);
INSERT INTO public.listing_details VALUES ('6ed43286-905f-44da-9fad-cc3904c708da', 3, 2, NULL, 2185.00, NULL, 2002, NULL, 'Finished', NULL, NULL, '{"fireplace": true}', '{"pool": true, "garage": true, "backyard": true, "parking_spaces": 1}', '{"cooling": "Central Air", "heating": "Forced Air"}', NULL);
INSERT INTO public.listing_details VALUES ('45660de5-7004-4084-9b70-65365be2b5f6', 3, 2, NULL, 1360.00, NULL, 2024, NULL, 'Finished', NULL, NULL, '{"fireplace": true}', '{"pool": true, "garage": true, "backyard": true, "parking_spaces": 1}', '{"cooling": "Window Unit", "heating": "Radiant"}', NULL);


--
-- Data for Name: listing_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: listing_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.listing_location VALUES ('e0151e13-ae73-492a-b218-c8ebaa481ce5', '524 Queen St W, Toronto, ON', NULL, 'Toronto', 'Ontario', 'M5H 3C2', 'Canada', 0.0000000, 0.0000000, '[{"name": "Maple Leaf School", "distance": "0.4 km"}, {"name": "Central High School", "distance": "1.2 km"}]', '[{"name": "City General Hospital", "distance": "2.5 km"}]', '[{"name": "Sunnydale Park", "distance": "0.2 km"}]', '[{"name": "Downtown Station", "distance": "0.8 km"}]', '[{"name": "Main St & 1st Ave", "distance": "0.1 km"}]', '[{"name": "Fresh Market", "distance": "0.5 km"}]', '[{"name": "Central Mall", "distance": "3.0 km"}]', '[{"name": "The Local Cafe", "distance": "0.3 km"}]', '[{"name": "FitLife Gym", "distance": "0.6 km"}]', 84, 64, 83, 8, 83, NULL, NULL, NULL);
INSERT INTO public.listing_location VALUES ('6ed43286-905f-44da-9fad-cc3904c708da', '100 City Centre Dr', NULL, 'Mississauga', 'Ontario', 'L5B 2C9', 'Canada', 0.0000000, 0.0000000, '[{"name": "Maple Leaf School", "distance": "0.4 km"}, {"name": "Central High School", "distance": "1.2 km"}]', '[{"name": "City General Hospital", "distance": "2.5 km"}]', '[{"name": "Sunnydale Park", "distance": "0.2 km"}]', '[{"name": "Downtown Station", "distance": "0.8 km"}]', '[{"name": "Main St & 1st Ave", "distance": "0.1 km"}]', '[{"name": "Fresh Market", "distance": "0.5 km"}]', '[{"name": "Central Mall", "distance": "3.0 km"}]', '[{"name": "The Local Cafe", "distance": "0.3 km"}]', '[{"name": "FitLife Gym", "distance": "0.6 km"}]', 75, 62, 94, 8, 92, NULL, NULL, NULL);
INSERT INTO public.listing_location VALUES ('45660de5-7004-4084-9b70-65365be2b5f6', '300 Dufferin Ave', NULL, 'London', 'Ontario', 'N6B 1Z2', 'Canada', 0.0000000, 0.0000000, '[{"name": "Maple Leaf School", "distance": "0.4 km"}, {"name": "Central High School", "distance": "1.2 km"}]', '[{"name": "City General Hospital", "distance": "2.5 km"}]', '[{"name": "Sunnydale Park", "distance": "0.2 km"}]', '[{"name": "Downtown Station", "distance": "0.8 km"}]', '[{"name": "Main St & 1st Ave", "distance": "0.1 km"}]', '[{"name": "Fresh Market", "distance": "0.5 km"}]', '[{"name": "Central Mall", "distance": "3.0 km"}]', '[{"name": "The Local Cafe", "distance": "0.3 km"}]', '[{"name": "FitLife Gym", "distance": "0.6 km"}]', 85, 58, 78, 8, 67, NULL, NULL, NULL);
INSERT INTO public.listing_location VALUES ('4b2203e3-7f31-4906-b5f9-858d4375a975', '123 mapple street', NULL, 'Toronto', 'Ontario', 'M4B 1L4', 'Canada', 0.0000000, 0.0000000, '[{"name": "Maple Leaf School", "distance": "0.4 km"}, {"name": "Central High School", "distance": "1.2 km"}]', '[{"name": "City General Hospital", "distance": "2.5 km"}]', '[{"name": "Sunnydale Park", "distance": "0.2 km"}]', '[{"name": "Downtown Station", "distance": "0.8 km"}]', '[{"name": "Main St & 1st Ave", "distance": "0.1 km"}]', '[{"name": "Fresh Market", "distance": "0.5 km"}]', '[{"name": "Central Mall", "distance": "3.0 km"}]', '[{"name": "The Local Cafe", "distance": "0.3 km"}]', '[{"name": "FitLife Gym", "distance": "0.6 km"}]', 93, 79, 84, 6, 90, NULL, NULL, NULL);


--
-- Data for Name: listing_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.listing_media VALUES ('bc75ff1d-10c0-4f6d-9b7c-dc3e6d462c8e', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', 'image', '/uploads/media/5f0c39688b9a36f8d847340b88bb9681', 'cover_photo', 72, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', true, '2026-08-01 10:44:35.597496');
INSERT INTO public.listing_media VALUES ('d6c8d406-f341-41c9-8f45-e43d7de76b83', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', 'image', '/uploads/media/d93fb17f51128fd19dc631d8fd5c2e7f', 'living_room', 70, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 10:47:35.537366');
INSERT INTO public.listing_media VALUES ('81d09f3b-607e-4f08-9d4a-a21cd5bf39e5', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', 'image', '/uploads/media/d6999601bb0fee920630481cf9eed1c5', 'kitchen', 81, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 10:47:35.598495');
INSERT INTO public.listing_media VALUES ('b80ac498-3f90-464d-ba3e-57fb41853407', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', 'image', '/uploads/media/10eb14edc03f8ce0bfcbf1a4b451f51b', 'cover_photo', 70, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 11:27:10.384278');
INSERT INTO public.listing_media VALUES ('fc9f2d7e-cb03-45d1-9eab-cd7566d1ace6', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', 'image', '/uploads/media/010fa4ea2f8b4acd542587f592a9d35c', 'living_room', 96, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 11:27:10.465643');
INSERT INTO public.listing_media VALUES ('4036e80f-ca99-432a-9890-256776d9c50e', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', 'image', '/uploads/media/ce77bc255976547e6863c687c50ae97d', 'kitchen', 85, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 11:27:10.534904');
INSERT INTO public.listing_media VALUES ('1abfbed3-3b8d-4377-b269-4962d8ffe8a7', '6ed43286-905f-44da-9fad-cc3904c708da', 'image', '/uploads/media/32040242ef5c576cbdb93f8910d631e9', 'cover_photo', 79, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', true, '2026-08-01 14:27:48.512766');
INSERT INTO public.listing_media VALUES ('761d6d4e-03a5-4d07-ba6b-761628227795', '6ed43286-905f-44da-9fad-cc3904c708da', 'image', '/uploads/media/78cf652a360a1305c0a38a678456f16e', 'living_room', 75, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 14:27:54.719262');
INSERT INTO public.listing_media VALUES ('0b2e9240-1245-400b-ac3d-c6812d2315b3', '6ed43286-905f-44da-9fad-cc3904c708da', 'image', '/uploads/media/9fed3f2fdf1ea79dd8c923c494863aef', 'kitchen', 95, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 14:27:54.749498');
INSERT INTO public.listing_media VALUES ('070ad9a1-6c05-4e8c-812b-baf87081b84c', '6ed43286-905f-44da-9fad-cc3904c708da', 'image', '/uploads/media/def2250f79f0e1edbee859beb416ea52', 'bedroom', 85, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 14:27:54.777913');
INSERT INTO public.listing_media VALUES ('ba55a607-0eaa-40c9-9235-6f4a02a5cd65', '6ed43286-905f-44da-9fad-cc3904c708da', 'image', '/uploads/media/e42c7ee037ed0e345fa20803981f5de0', 'bathroom', 98, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 14:27:54.804586');
INSERT INTO public.listing_media VALUES ('cfa3b260-c38b-45dd-b6ad-00a2fbafb714', '6ed43286-905f-44da-9fad-cc3904c708da', 'image', '/uploads/media/539230e89839391d3bfd951989e82913', 'dining_room', 91, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 14:27:54.82791');
INSERT INTO public.listing_media VALUES ('ffc638fd-93e2-47a7-92a3-dd6e2054e7f0', '6ed43286-905f-44da-9fad-cc3904c708da', 'image', '/uploads/media/81ec6f73d3374cb4c377bbb2a102298a', 'exterior', 83, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 14:27:54.852214');
INSERT INTO public.listing_media VALUES ('f0b64315-3fb0-49ec-b8f3-ca89d3c51c1a', '45660de5-7004-4084-9b70-65365be2b5f6', 'image', '/uploads/media/3f2b38926ced4c9db3ad7167340b3ae4', 'cover_photo', 83, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', true, '2026-08-01 16:06:19.834335');
INSERT INTO public.listing_media VALUES ('c2791340-b969-4397-97d5-ae6504d6a361', '45660de5-7004-4084-9b70-65365be2b5f6', 'image', '/uploads/media/1980c6f5eb9fb050a5fe532360c41dc2', 'living_room', 93, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 16:06:36.761482');
INSERT INTO public.listing_media VALUES ('d642fffe-f3ce-4a4b-8f38-986135c24428', '45660de5-7004-4084-9b70-65365be2b5f6', 'image', '/uploads/media/73534957bfa2dacaf2e519889af33dd9', 'kitchen', 76, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 16:06:36.826929');
INSERT INTO public.listing_media VALUES ('90190a09-4afe-45ad-9d7e-71c1674b0667', '45660de5-7004-4084-9b70-65365be2b5f6', 'image', '/uploads/media/af0b755a49b0dc4c9685cac8130ff253', 'bedroom', 83, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 16:06:36.870426');
INSERT INTO public.listing_media VALUES ('7d6de548-468e-4e85-a7cc-5cb9a240a851', '45660de5-7004-4084-9b70-65365be2b5f6', 'image', '/uploads/media/1bb86cdf574f8dcdeedc0de8a7fdeed8', 'bathroom', 93, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 16:06:36.912883');
INSERT INTO public.listing_media VALUES ('e479d59e-196c-4dd1-bbf3-1ae74e68331e', '45660de5-7004-4084-9b70-65365be2b5f6', 'image', '/uploads/media/7a8a7df91d257546727c75cad12fe517', 'dining_room', 80, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 16:06:36.952176');
INSERT INTO public.listing_media VALUES ('65310bbd-fbcc-4c63-bf9b-176450eb1765', '45660de5-7004-4084-9b70-65365be2b5f6', 'image', '/uploads/media/dd4952ec4101bc7abad29a90e202a53d', 'exterior', 90, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 16:06:36.993979');
INSERT INTO public.listing_media VALUES ('41a363da-c691-46aa-82d6-1852e098a3f4', '4b2203e3-7f31-4906-b5f9-858d4375a975', 'image', '/uploads/media/e7bd2c18f406066f133693dfa1a2dc16', 'cover_photo', 70, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', true, '2026-08-01 18:53:26.656736');
INSERT INTO public.listing_media VALUES ('1326d90f-3123-4e80-9835-c6fb2f182e6d', '4b2203e3-7f31-4906-b5f9-858d4375a975', 'image', '/uploads/media/f3780992cb5b5800537a985a376da2d6', 'living_room', 96, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 18:53:41.660734');
INSERT INTO public.listing_media VALUES ('2764f6ff-6b45-4173-bbf9-879cceff716e', '4b2203e3-7f31-4906-b5f9-858d4375a975', 'image', '/uploads/media/6e4b99b19295d6717623ba7b34afe44d', 'kitchen', 97, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 18:53:41.741324');
INSERT INTO public.listing_media VALUES ('57df08be-999a-46e9-a4f5-d64e7fd418cc', '4b2203e3-7f31-4906-b5f9-858d4375a975', 'image', '/uploads/media/52b46306c42300a30a3e929d41aa1666', 'bedroom', 94, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 18:53:41.813988');
INSERT INTO public.listing_media VALUES ('437e4300-3968-4b7f-a23e-17a2702764a9', '4b2203e3-7f31-4906-b5f9-858d4375a975', 'image', '/uploads/media/ce9296484c3360a5d7a7e40ee8db6b8e', 'bathroom', 82, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 18:53:41.892659');
INSERT INTO public.listing_media VALUES ('616ea016-85f4-448c-9262-874bc9828f75', '4b2203e3-7f31-4906-b5f9-858d4375a975', 'image', '/uploads/media/297fc1cb4fb688afbbae583281e97c85', 'dining_room', 78, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 18:53:41.952537');
INSERT INTO public.listing_media VALUES ('42237156-22c4-490e-b86e-c2f59e6b4dc7', '4b2203e3-7f31-4906-b5f9-858d4375a975', 'image', '/uploads/media/c6b03ca95893b08a0810fed5a031ec15', 'exterior', 76, '{"blur": false, "duplicate": false, "brightness": "good", "resolution": "high"}', false, '2026-08-01 18:53:42.002885');


--
-- Data for Name: listing_verification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: property_analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.property_analytics VALUES ('d5b7f9d6-f52e-43e3-9058-584547e937fd', 0, 0, 0, 0, 0, 0, 0, 0, '2026-08-01 18:57:39.287516');
INSERT INTO public.property_analytics VALUES ('e0151e13-ae73-492a-b218-c8ebaa481ce5', 31, 1, 0, 0, 31, 1, 0, 0, '2026-08-01 18:59:47.985027');
INSERT INTO public.property_analytics VALUES ('6ed43286-905f-44da-9fad-cc3904c708da', 5, 2, 0, 0, 5, 2, 0, 0, '2026-08-01 16:19:13.64192');
INSERT INTO public.property_analytics VALUES ('45660de5-7004-4084-9b70-65365be2b5f6', 5, 1, 0, 0, 5, 1, 0, 0, '2026-08-01 16:59:04.114142');
INSERT INTO public.property_analytics VALUES ('4b2203e3-7f31-4906-b5f9-858d4375a975', 1, 1, 0, 0, 1, 1, 0, 0, '2026-08-01 18:56:37.05145');


--
-- Data for Name: recently_viewed; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.recently_viewed VALUES ('1e63f599-0503-4924-86ed-a505ff15856c', '4f46358d-4157-42ac-8f69-27bf302cf4b3', NULL, 'e0151e13-ae73-492a-b218-c8ebaa481ce5', '2026-08-01 10:57:19.818931');
INSERT INTO public.recently_viewed VALUES ('3f1994e7-e810-437b-9f26-287391522577', NULL, 'test-session-123', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', '2026-08-01 12:29:51.894038');
INSERT INTO public.recently_viewed VALUES ('ecde11f9-7634-4e0d-9033-327f1fbca6b3', NULL, 'test-session-456', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', '2026-08-01 12:30:54.526434');
INSERT INTO public.recently_viewed VALUES ('02972aa8-fde6-4a39-81ad-b5a50703d417', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'sess_3ed9d7nul1785567385849', '6ed43286-905f-44da-9fad-cc3904c708da', '2026-08-01 14:28:09.721255');
INSERT INTO public.recently_viewed VALUES ('d7d37fd1-668a-473f-bc7c-b608e243b5ca', 'c266f73f-de2f-4460-9471-69421bd4dc3b', 'sess_3ed9d7nul1785567385849', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', '2026-08-01 15:55:36.706628');
INSERT INTO public.recently_viewed VALUES ('bd84e196-8fd6-4729-8009-29eaf621c69e', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'sess_3ed9d7nul1785567385849', '45660de5-7004-4084-9b70-65365be2b5f6', '2026-08-01 16:07:03.573374');
INSERT INTO public.recently_viewed VALUES ('82932101-dfe3-4461-ae53-5868176d98c2', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'sess_3ed9d7nul1785567385849', '4b2203e3-7f31-4906-b5f9-858d4375a975', '2026-08-01 18:56:28.743688');


--
-- Data for Name: revoked_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: saved_properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.saved_properties VALUES ('fe3fbead-95cd-4c79-ab19-5f9ad8d07a23', '4f46358d-4157-42ac-8f69-27bf302cf4b3', 'e0151e13-ae73-492a-b218-c8ebaa481ce5', '2026-08-01 12:50:50.795329');
INSERT INTO public.saved_properties VALUES ('77e323a6-0e91-4133-ab7f-403f5309bd3d', '4f46358d-4157-42ac-8f69-27bf302cf4b3', '6ed43286-905f-44da-9fad-cc3904c708da', '2026-08-01 14:29:32.101529');
INSERT INTO public.saved_properties VALUES ('462d989a-1856-4408-bdcb-ca2ea3591d01', 'c266f73f-de2f-4460-9471-69421bd4dc3b', '6ed43286-905f-44da-9fad-cc3904c708da', '2026-08-01 15:55:44.777863');
INSERT INTO public.saved_properties VALUES ('2edba66b-974f-4d1a-8272-6779114f98f3', '4f46358d-4157-42ac-8f69-27bf302cf4b3', '45660de5-7004-4084-9b70-65365be2b5f6', '2026-08-01 16:10:27.191206');
INSERT INTO public.saved_properties VALUES ('bc85b642-a62d-49a1-83f5-93a9d9eb4192', '4f46358d-4157-42ac-8f69-27bf302cf4b3', '4b2203e3-7f31-4906-b5f9-858d4375a975', '2026-08-01 18:56:37.020742');


--
-- PostgreSQL database dump complete
--

\unrestrict CwoqcNGfVeqI66lhLvm17PUPFsct9eZd51dz6euYwI1edeajexuOPQyhAe2PxeI

