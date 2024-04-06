"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { COUNTRIES } from "@/components/countries";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { HiOutlinePlus } from "react-icons/hi2";
import { HiOutlineXMark } from "react-icons/hi2";
import { toast } from "@/components/ui/use-toast";
import { PlaceType } from "@/types";
import axios from "axios";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const places = [
  { name: "House", icon: "/home.png" },
  { name: "Apartment", icon: "/apartment.png" },
  { name: "Bed & breakfast", icon: "/breakfast.png" },
  { name: "Boat", icon: "/boat.png" },
  { name: "Cabin", icon: "/cabin.png" },
  { name: "Hotel", icon: "/hotel.png" },
];

const placeAmenities = [
  { name: "Wifi", icon: "/wifi.png" },
  { name: "TV", icon: "/tv.png" },
  { name: "Kitchen", icon: "/kitchen-set.png" },
  { name: "Washer", icon: "/washer.png" },
  { name: "Parking", icon: "/car.png" },
  { name: "Air conditioning", icon: "/snowflake.png" },
  { name: "WorkSpace", icon: "/desk.png" },
];

const placeStandoutAmenities = [
  { name: "Pool", icon: "/pool.png" },
  { name: "Hot tub", icon: "/hot-bath.png" },
  { name: "BBQ grill", icon: "/grill.png" },
  { name: "Exercise equipment", icon: "/gym.png" },
  { name: "Beach access", icon: "/beach.png" },
];

const SafetyItems = [
  { name: "Smoke alarm", icon: "/alarm.png" },
  { name: "First aid kit", icon: "/first-aid-kit.png" },
  { name: "Fire extinguisher", icon: "/fire.png" },
  { name: "Carbon monoxide alarm", icon: "/carbon.png" },
];

const Page = () => {
  const [place, setPlace] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apt, setApt] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const country = useRef<HTMLSelectElement>(null);
  const [guestNumber, setGuestNumber] = useState(1);
  const [bedRoomNumber, setBedRoomNumber] = useState(0);
  const [bedNumber, setBedNumber] = useState(1);
  const [bathroomNumber, setBathroomNumber] = useState(1);
  const [PlaceAmenities, setPlaceAmenities] = useState<string[]>([]);
  const [PlaceStandoutAmenities, setPlaceStandoutAmenities] = useState<
    string[]
  >([]);
  const [safetyItems, setSafetyItems] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const placeName = useRef<HTMLTextAreaElement>(null);
  const placeDescription = useRef<HTMLTextAreaElement>(null);
  const [price, setPrice] = useState(200);
  const [session, setSession] = useState<Session | null>();
  const router = useRouter()
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
  }, []);
  
  const handleAddPlaceAmenities = (item: string) => {
    setPlaceAmenities((prevState) => [...prevState, item]);
  };
  const handleRemovePlaceAmenities = (item: string) => {
    const index = PlaceAmenities.indexOf(item);
    if (index !== -1) {
      setPlaceAmenities((prevState) => prevState.filter((_, i) => i !== index));
    }
  };

  const handleAddPlaceStandoutAmenities = (item: string) => {
    setPlaceStandoutAmenities((prevState) => [...prevState, item]);
  };
  const handleRemovePlaceStandoutAmenities = (item: string) => {
    const index = PlaceStandoutAmenities.indexOf(item);
    if (index !== -1) {
      setPlaceStandoutAmenities((prevState) =>
        prevState.filter((_, i) => i !== index)
      );
    }
  };

  const handleAddSafetyItems = (item: string) => {
    setSafetyItems((prevState) => [...prevState, item]);
  };
  const handleRemoveSafetyItems = (item: string) => {
    const index = safetyItems.indexOf(item);
    if (index !== -1) {
      setSafetyItems((prevState) => prevState.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      setSelectedImage((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleDelete = (name: string) => {
    setSelectedImage(selectedImage.filter((pic) => pic.name !== name));
  };

  const handleSave = async () => {
    if (!place) {
      toast({
        className: "rounded-[5px] p-4 text-red-600",
        description: "You should select the place type",
      });
      return;
    } else if (
      !(
        province ||
        country
      )
    ) {
      toast({
        className: "rounded-[5px] p-4 text-red-600",
        description: "You should fill all location fields",
      });
      return;
    } else if (selectedImage.length < 3) {
      toast({
        className: "rounded-[5px] p-4 text-red-600",
        description: "You should add more than one image to your place",
      });
      return;
    } else if (!placeName) {
      toast({
        className: "rounded-[5px] p-4 text-red-600",
        description: "You should fill the name of the place",
      });
      return;
    }    
    setLoaded(false)

    let base64Img: string[] = [];

    await Promise.all(
      selectedImage.map(async (file, index) => {
        const base64: string = (await toBase64(file as File)) as string;
        base64Img.push(base64);
      })
    );
    const combinedAmenities = [
      ...PlaceAmenities,
      ...PlaceStandoutAmenities,
      ...safetyItems,
    ];

    const data: PlaceType = {
      user_id: session?.user.id,
      user_email: session?.user.email,
      placeType: place,
      neighborhood: neighborhood,
      streetAddress: streetAddress,
      apt: apt,
      postalCode: postalCode,
      district: district,
      province: province,
      country: country.current?.value,
      guest_number: guestNumber,
      bed_room_number: bedRoomNumber,
      bed_number: bedNumber,
      bath_room_number: bathroomNumber,
      amenities: combinedAmenities,
      place_name: placeName.current?.value,
      place_description: placeDescription.current?.value,
      price: price,
      images: base64Img,
      status:"avalible"
    };

    try {
      const res=await axios.post("/api/hosting", data);
      router.push(`/place/${res.data.message.data[0].id}`)

      toast({
        className: "rounded-[5px] p-4 text-green-600",
        description: "Your place pulished succsesfully",
      });
    } catch (err) {
      toast({
        className: "rounded-[5px] p-4 text-red-600",
        description: "An error happened while pulishing your place",
      });
    }
  };

  return (
    <div className="w-screen flex justify-center items-center flex-col py-20">
      {loaded?
      <><div className="w-[750px] flex flex-col justify-center items-center">
          <p className="text-lg font-black p-5">
            Which of these best describes your place?
          </p>
          <div className=" grid grid-cols-3 w-full gap-10">
            {places.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ x: -3 }}
                transition={{ duration: 0.5 }}
                className={`transtion-bg flex flex-col justify-center items-center gap-3 p-16 border rounded-xl hover:cursor-pointer hover:bg-lightGray ${place == item.name && "border-primary border-2 bg-lightGray"}`}
                onClick={() => setPlace(item.name)}
              >
                <Image src={item.icon} alt={item.name} width={50} height={50} />
                <p className="text-sm font-bold">{item.name}</p>
              </motion.div>
            ))}
          </div>
        </div><div className="w-[750px] flex flex-col justify-center">
            <p className="text-lg font-black pt-10">Confirm your address</p>
            <p className="text-md text-darkGray pb-4">
              Your address is only shared with guests after they’ve made a
              reservation.
            </p>
            <Select label="Select a country/region" ref={country}>
              {COUNTRIES.map((item) => (
                <SelectItem key={item.title} value={item.title}>
                  {item.title}
                </SelectItem>
              ))}
            </Select>
            <div className=" py-5 gap-2 flex flex-col">
              <Input
                onChange={(e) => setNeighborhood(e.target.value)}
                type="text"
                label="Neighborhood" />
              <Input
                onChange={(e) => setStreetAddress(e.target.value)}
                type="text"
                label="Street address" />
              <Input
                onChange={(e) => setApt(e.target.value)}
                type="text"
                label="Apt, floor, bldg" />
              <Input
                onChange={(e) => setPostalCode(e.target.value)}
                type="text"
                label="Postal code" />
              <Input
                onChange={(e) => setDistrict(e.target.value)}
                type="text"
                label="District" />
              <Input
                onChange={(e) => setProvince(e.target.value)}
                type="text"
                label="Province" />
            </div>
          </div><div className="w-[750px] flex flex-col justify-center">
            <p className="text-lg font-black pt-10">
              Share some basics about your place
            </p>
            <p className="text-md text-darkGray pb-4">
              You'll add more details later, like bed types.
            </p>
            <div className="flex items-center justify-between border-b border-lightGray p-4 text-md">
              <p className="">Guest</p>
              <span className="flex items-center gap-2">
                <CiCircleMinus
                  className="hover:cursor-pointer"
                  onClick={() => guestNumber != 1 && setGuestNumber(guestNumber - 1)}
                  size={40} />
                <p>{guestNumber}</p>
                <CiCirclePlus
                  className="hover:cursor-pointer"
                  onClick={() => setGuestNumber(guestNumber + 1)}
                  size={40} />
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-lightGray p-4 text-md">
              <p className="">Bedroom</p>
              <span className="flex items-center gap-2">
                <CiCircleMinus
                  className="hover:cursor-pointer"
                  onClick={() => bedRoomNumber != 0 && setBedRoomNumber(bedRoomNumber - 1)}
                  size={40} />
                <p>{bedRoomNumber}</p>
                <CiCirclePlus
                  className="hover:cursor-pointer"
                  onClick={() => setBedRoomNumber(bedRoomNumber + 1)}
                  size={40} />
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-lightGray p-4 text-md">
              <p className="">Beds</p>
              <span className="flex items-center gap-2">
                <CiCircleMinus
                  className="hover:cursor-pointer"
                  onClick={() => bedNumber != 1 && setBedNumber(bedNumber - 1)}
                  size={40} />
                <p>{bedNumber}</p>
                <CiCirclePlus
                  className="hover:cursor-pointer"
                  onClick={() => setBedNumber(bedNumber + 1)}
                  size={40} />
              </span>
            </div>
            <div className="flex items-center justify-between p-4 text-md">
              <p className="">Bathrooms</p>
              <span className="flex items-center gap-2">
                <CiCircleMinus
                  className="hover:cursor-pointer"
                  onClick={() => bathroomNumber != 1 && setBathroomNumber(bathroomNumber - 1)}
                  size={40} />
                <p>{bathroomNumber}</p>
                <CiCirclePlus
                  className="hover:cursor-pointer"
                  onClick={() => setBathroomNumber(bathroomNumber + 1)}
                  size={40} />
              </span>
            </div>
          </div><div className="w-[750px] flex flex-col justify-center">
            <p className="text-lg font-black pt-10">
              Tell guests what your place has to offer
            </p>
            <div className=" grid grid-cols-3 w-full gap-10">
              {placeAmenities.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: -3 }}
                  transition={{ duration: 0.5 }}
                  className={`transtion-bg flex flex-col justify-center items-center gap-3 p-16 border rounded-xl hover:cursor-pointer hover:bg-lightGray ${PlaceAmenities.find((i) => i == item.name) &&
                    "border-primary border-2 bg-lightGray"}`}
                  onClick={() => PlaceAmenities.find((i) => i == item.name)
                    ? handleRemovePlaceAmenities(item.name)
                    : handleAddPlaceAmenities(item.name)}
                >
                  <Image src={item.icon} alt={item.name} width={50} height={50} />
                  <p className="text-sm font-bold">{item.name}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-md text-darkGray pb-4">
              You'll add more details later, like bed types.
            </p>
            <div className=" grid grid-cols-3 w-full gap-10">
              {placeStandoutAmenities.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: -3 }}
                  transition={{ duration: 0.5 }}
                  className={`transtion-bg flex flex-col justify-center items-center gap-3 p-16 border rounded-xl hover:cursor-pointer hover:bg-lightGray ${PlaceStandoutAmenities.find((i) => i == item.name) &&
                    "border-primary border-2 bg-lightGray"}`}
                  onClick={() => PlaceStandoutAmenities.find((i) => i == item.name)
                    ? handleRemovePlaceStandoutAmenities(item.name)
                    : handleAddPlaceStandoutAmenities(item.name)}
                >
                  <Image src={item.icon} alt={item.name} width={50} height={50} />
                  <p className="text-sm font-bold">{item.name}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-md text-darkGray py-4">
              Do you have any standout amenities?
            </p>
            <div className=" grid grid-cols-3 w-full gap-10">
              {SafetyItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: -3 }}
                  transition={{ duration: 0.5 }}
                  className={`transtion-bg flex flex-col justify-center items-center gap-3 p-16 border rounded-xl hover:cursor-pointer hover:bg-lightGray ${safetyItems.find((i) => i == item.name) &&
                    "border-primary border-2 bg-lightGray"}`}
                  onClick={() => safetyItems.find((i) => i == item.name)
                    ? handleRemoveSafetyItems(item.name)
                    : handleAddSafetyItems(item.name)}
                >
                  <Image src={item.icon} alt={item.name} width={50} height={50} />
                  <p className="text-sm font-bold">{item.name}</p>
                </motion.div>
              ))}
            </div>
          </div><div className="w-[750px] flex flex-col justify-center">
            <p className="text-lg font-black pt-10">
              Add some photos of your Place
            </p>
            <p className="text-md text-darkGray pb-4">
              You'll need 5 photos to get started. You can add more or make changes
              later.
            </p>
            {selectedImage.length > 0 && [
              <span>
                <HiOutlineXMark
                  className="absolute cursor-pointer"
                  size="30"
                  onClick={(e) => handleDelete(selectedImage[0].name)} />
                <img
                  src={URL.createObjectURL(selectedImage[0])}
                  alt="Selected"
                  className={`rounded-[10px] w-full h-[500px] mb-3`} />
              </span>,
              <div className="grid grid-cols-2 gap-2">
                {selectedImage.slice(1).map((pic, index) => (
                  <span>
                    <HiOutlineXMark
                      stroke="black"
                      className="absolute cursor-pointer"
                      size="30"
                      onClick={(e) => handleDelete(pic.name)} />
                    <img
                      src={URL.createObjectURL(pic)}
                      alt="Selected"
                      className={`w-[380px] h-[300px] rounded-[10px] `} />
                  </span>
                ))}
              </div>,
            ]}
            <label
              htmlFor="fileInput"
              className={`flex items-center justify-center w-[340px] h-[230px] rounded-[10px] border border-lightGray hover:bg-lightGray transtion-bg`}
            >
              <HiOutlinePlus className="cursor-pointer" size={40} />
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              multiple />
          </div><div className="w-[750px] flex flex-col justify-center">
            <p className="text-lg font-black pt-10">
              Now, let's give your house a title
            </p>
            <p className="text-md text-darkGray pb-4">
              Short titles work best. Have fun with it—you can always change it
              later.
            </p>
            <textarea
              ref={placeName}
              className="h-[300px] p-8 border border-lightGray outline-darkGray rounded-[5px]" />
          </div><div className="w-[750px] flex flex-col justify-center">
            <p className="text-lg font-black pt-10">Create your description</p>
            <p className="text-md text-darkGray pb-4">
              Share what makes your place special.
            </p>
            <textarea
              ref={placeDescription}
              className="h-[300px] p-8 border border-lightGray outline-darkGray rounded-[5px]" />
          </div><div className="w-[750px] flex flex-col justify-center">
            <p className="text-lg font-black pt-10">Now, set your price</p>
            <p className="text-md text-darkGray pb-4">You can change it anytime.</p>
            <span className="flex text-xxlg ">
              <p>$</p>
              <input
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className="focus:outline-none" />
            </span>
          </div><Button size="lg" color="danger" className="m-5" onClick={handleSave}>
            Save & publish
          </Button>
          </>
        :<div className="h-[80vh] flex items-center justify-center">
        <div className="container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>}
    </div>
  );
};

const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export default Page;
