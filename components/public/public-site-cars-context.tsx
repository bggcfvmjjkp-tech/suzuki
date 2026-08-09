"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

export type PublicNavCar = {
  name: string;
  price: string;
  img: string;
  desc: string;
  isContact?: boolean;
  slug: string;
};

type PublicSiteCarsContextValue = {
  currentCars: PublicNavCar[];
  serviceCars: PublicNavCar[];
  settings: Record<string, string>;
  isLoading: boolean;
};

const PublicSiteCarsContext = createContext<PublicSiteCarsContextValue | null>(
  null
);

function loadStaticNavCars(): {
  currentCars: PublicNavCar[];
  serviceCars: PublicNavCar[];
} {
  return {
    currentCars: [
      {
        name: "VF 3",
        price: "235.000.000 VNĐ",
        img: "/car/imgi_9_1.png",
        desc: "Mẫu SUV điện cỡ nhỏ đầu tiên, thiết kế cá tính, nhỏ gọn và tiện dụng cho đô thị.",
        slug: "vf-3",
      },
      {
        name: "VF 5",
        price: "468.000.000 VNĐ",
        img: "/car/imgi_10_3-2.png",
        desc: "Trải nghiệm lái phấn khích cùng thiết kế thời thượng hướng tới tương lai.",
        slug: "vf-5",
      },
      {
        name: "VF 6",
        price: "675.000.000 VNĐ",
        img: "/car/imgi_11_4.png",
        desc: "Kiệt tác nghệ thuật với thiết kế hiện đại, tinh tế cùng công nghệ tiên tiến.",
        slug: "vf-6",
      },
      {
        name: "VF 7",
        price: "850.000.000 VNĐ",
        img: "/car/imgi_12_5.png",
        desc: "Đỉnh cao thiết kế mang cảm hứng vũ trụ phi đối xứng, uy dũng và sang trọng.",
        slug: "vf-7",
      },
      {
        name: "VF 8",
        price: "1.079.000.000 VNĐ",
        img: "/car/imgi_13_6.png",
        desc: "SUV cỡ trung mạnh mẽ, thông minh, mang lại trải nghiệm đẳng cấp toàn cầu.",
        slug: "vf-8",
      },
      {
        name: "VF 9",
        price: "1.499.000.000 VNĐ",
        img: "/car/imgi_14_7.png",
        desc: "Tuyệt tác SUV Full-size cao cấp nhất, khẳng định vị thế và quyền uy người dùng.",
        slug: "vf-9",
      },
    ],
    serviceCars: [
      {
        name: "VinFast Minio Green",
        price: "250.000.000 VNĐ",
        img: "/car/imgi_15_Minio-green-mau-bac-540x282.png",
        desc: "Dòng xe dịch vụ xanh, tiết kiệm năng lượng tối đa.",
        slug: "vinfast-minio-green",
      },
      {
        name: "VinFast Herio Green",
        price: "499.000.000 VNĐ",
        img: "/car/imgi_16_Herio-Green-mau-vang-540x282.png",
        desc: "Giải pháp vận tải thông minh cho môi trường đô thị hiện đại.",
        slug: "vinfast-herio-green",
      },
      {
        name: "VinFast Nerio Green",
        price: "508.000.000 VNĐ",
        img: "/car/imgi_17_Nerio-Green-mau-do-540x282-1.png",
        desc: "Không gian rộng rãi, vận hành êm ái, thân thiện với môi trường.",
        slug: "vinfast-nerio-green",
      },
      {
        name: "VinFast Limo Green",
        price: "749.000.000 VNĐ",
        img: "/car/imgi_18_Limo-Green-mau-vang-540x282.png",
        desc: "Dịch vụ vận tải cao cấp chuẩn Limousine không phát thải.",
        slug: "vinfast-limo-green",
      },
      {
        name: "VinFast EC Van",
        price: "289.000.000 VNĐ",
        img: "/car/imgi_19_3-9-e1749183878376-2.jpg",
        desc: "Tối ưu hóa không gian chở hàng, giải pháp logistics xanh.",
        slug: "vinfast-ec-van",
      },
      {
        name: "VinFast Wild",
        price: "Liên Hệ",
        img: "/news/imgi_20_vf-wild-ban-tai.png",
        desc: "Sức mạnh vượt trội, chinh phục mọi địa hình với công nghệ thuần điện.",
        isContact: true,
        slug: "vinfast-wild",
      },
    ],
  };
}

async function fetchNavCarsFromSupabase(): Promise<{
  currentCars: PublicNavCar[];
  serviceCars: PublicNavCar[];
} | null> {
  const { data: carsData, error } = await supabase.from("cars").select(`
      *,
      car_categories (
        name,
        slug
      )
    `);

  if (error) throw error;
  if (!carsData?.length) return null;

  const mapRow = (c: (typeof carsData)[0]): PublicNavCar => ({
    name: c.name,
    price: c.price,
    img: c.main_image,
    desc: c.short_description ?? "",
    isContact: c.is_contact,
    slug: c.slug,
  });

  const hienDai = carsData.filter(
    (c) => c.car_categories?.slug === "xe-hien-dai"
  );
  const dichVu = carsData.filter(
    (c) => c.car_categories?.slug === "xe-dich-vu"
  );

  return {
    currentCars: hienDai.map(mapRow),
    serviceCars: dichVu.map(mapRow),
  };
}

export function PublicSiteCarsProvider({ children }: { children: ReactNode }) {
  const [currentCars, setCurrentCars] = useState<PublicNavCar[]>([]);
  const [serviceCars, setServiceCars] = useState<PublicNavCar[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const applyStatic = useCallback(() => {
    const { currentCars: c, serviceCars: s } = loadStaticNavCars();
    setCurrentCars(c);
    setServiceCars(s);
  }, []);

  const refreshSettings = useCallback(async () => {
    const { data: settingsData } = await supabase
      .from("settings")
      .select("key, value");
    const settingsMap = (settingsData || []).reduce<Record<string, string>>(
      (result, setting) => {
        result[setting.key] = setting.value ?? "";
        return result;
      },
      {}
    );
    setSettings(settingsMap);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fromDb = await fetchNavCarsFromSupabase();
        
        await refreshSettings();

        if (cancelled) return;

        if (fromDb) {
          setCurrentCars(fromDb.currentCars);
          setServiceCars(fromDb.serviceCars);
        } else {
          applyStatic();
        }
      } catch (e) {
        console.error("Lỗi khi fetch data (public layout):", e);
        if (!cancelled) applyStatic();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyStatic, refreshSettings]);

  useEffect(() => {
    const handleSettingsUpdated = () => {
      void refreshSettings();
    };
    window.addEventListener("public-settings-updated", handleSettingsUpdated);
    return () => window.removeEventListener("public-settings-updated", handleSettingsUpdated);
  }, [refreshSettings]);

  const value = useMemo(
    () => ({ currentCars, serviceCars, settings, isLoading }),
    [currentCars, serviceCars, settings, isLoading]
  );

  return (
    <PublicSiteCarsContext.Provider value={value}>
      {children}
    </PublicSiteCarsContext.Provider>
  );
}

export function usePublicSiteCars(): PublicSiteCarsContextValue {
  const ctx = useContext(PublicSiteCarsContext);
  if (!ctx) {
    throw new Error("usePublicSiteCars must be used within PublicSiteCarsProvider");
  }
  return ctx;
}
