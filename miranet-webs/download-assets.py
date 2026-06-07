"""
Script de descarga de imágenes desde Google Drive
Ejecutar: python3 download-assets.py
Requiere:  pip install gdown
"""
import os
import gdown

BASE = os.path.dirname(os.path.abspath(__file__))

HOTELS = {
    "suites-44/assets": [
        ("1KMaoKejxFceKu6mPNbVJ-P8grjsraUuR", "hab-01.png"),
        ("1jDigKzvTSd0qN2nEGMv6a8m__oegSh8-", "hab-02.png"),
        ("1ZmiJT-KT-WWYdNbcU8NdGrmLWrnLW5oG", "hab-03.png"),
        ("1qTPTiDr6tPkNYxO1RYIeDul1mDxfyF4M", "hab-04.png"),
        ("1TqS1M7GxkT7MQgD2SsJSeMWZAZ5IpVpW", "hab-05.png"),
        ("1zcxfU1rS8NOebI-4ElM8zTc_a1ajaNny",  "hab-06.png"),
        ("1-B2SSsrQVPxRRXR8iCkek3nCIHXUAjmV", "hab-07.png"),
        ("1lJG351jCxW-pYNlsjeTIy_PivRwzfQCN", "hab-08.png"),
        ("1sKARmnnUNS2VAYyz7FnYR92YCrPr9Xwi", "hab-09.png"),
        ("1WtyWJNNwFWTsixgZIU7g7Qbtyf1iBVeY", "hab-10.png"),
        ("1YZJQbkiPJcEJU7AyEAFVa-5ihcdMksdq", "hab-11.png"),
        ("1ihQ_KUUypiaRFmWtKQdvAyKjKboWyXxk", "hab-12.png"),
    ],
    "pomarosa/assets": [
        ("1Mj1KeQYlLLXuaNGVUG-Zm9jwTcqjiMzC", "hab-01.png"),
        ("1yt6sEybqD9njgMfhHzafv7o083Hq-nk-", "hab-02.png"),
        ("1_XbjeTMknKnIvakqSaWw09G6bojAX5Wk", "hab-03.png"),
        ("1gkhgHrF-sUJS1SYBYVRFR43BvxhSnN-G", "hab-04.png"),
        ("1QiMLh34F-5xyg37j54JIxBgFv8ilny_M", "hab-05.png"),
        ("1llxU9ClbwamDeEV_6fFn9cGGcTopez9D", "hab-06.png"),
        ("1cbsl3DXlVGU-WamjcHxKEZq-L8NhHwKm", "hab-07.png"),
        ("1miZrVpJQJ_dsPWSN4wor8MRYvat14fEk", "hab-08.png"),
        ("1G9x3LfpeRzY716M3TGAk-L57jJL6F93A", "hab-09.png"),
        ("1424f2rrbGA9bUG-ZXpOFhGlFKvjInwEr", "hab-10.png"),
        ("144-WkcmGNfvChI6pnrDBzrEL9dwah6Li", "hab-11.png"),
        ("1Jf1yC1l89oR321oa9ouB16G4r_XxvktG", "hab-12.png"),
        ("1jxChnZKZSc_PAxIh8LV0Bu7hF2e4E9ur", "hab-13.png"),
        ("1Ksh_T6H-MXQpoQ9QPx403_ROGpp99kdH", "hab-14.png"),
        ("1sGVGlyfCziXNSuItDM5gz0WjrK0GyXOQ", "hab-15.png"),
        ("1lRY_hmNARLrLT8fKThS4mEeMivCS6GQu", "hab-16.png"),
        ("1XYVTGCotC5FJRXDLZh7J5py320pmoxAl", "hab-17.png"),
        ("1n-XXCYaxin2dAbQPFZ6FLXjPwHzeZ1p2", "hab-18.png"),
        ("1ss_ARPWYtf-ZX-hWIsh2TNlQIi6kH8Ol", "hab-19.png"),
    ],
    "ceo/assets": [
        ("168dQccT_WauOkLQLZbBzM0NB7QVS1A38", "hab-01.png"),
        ("1CWtIzegLUdhwSbCddYo3fS04V7j5vioS", "hab-02.png"),
        ("1vHTIS1D_E2Kq45Ai1WFbmvbVDCsldhhQ", "hab-03.png"),
        ("1zlDeMZuS1oVN6TIM7uaiDpNTce5OptSL", "hab-04.png"),
        ("1R1ZYZ91wV11cFJdyqL474wu2gPSjE95B", "hab-05.png"),
        ("1koIWR4ftdh5DqDumht7ImgRWe1jbbBj4", "hab-06.png"),
        ("1cG4mgFuQMwFLNBvM77s2ulPFLhEBD79c", "hab-07.png"),
        ("1XzQNNSf_HdyKjD82VedpZtDaCm4yAGZc", "hab-08.png"),
        ("1cN02ZYPBIPgffnX8DuiE5hCmo0CvlkLC", "hab-09.png"),
        ("1nonctRnJJrYgOIZH6dhW-AupGzPK7iLM", "hab-10.png"),
        ("1sdsd4vHbzFReB3ggbYN8rpKj1iWUx8AB", "hab-11.png"),
        ("19UWdDoHDGSPIX3ECr2kqXUx1PUzfMKqo", "hab-12.png"),
        ("1H8IZ5WG4DWZ1SKDuk-69cMKU2EQuF1oO", "hab-13.png"),
        ("1APNgMblebOp1bhhrJqLt_NnBWUwDzq_8", "hab-14.png"),
        ("1mZHooMruB5BKm4Cpefvi0A9DPove6a_U", "hab-15.png"),
        ("1ciDmzcXdn-fTWnoyeSXR0AJ8f-TXXK6F", "hab-16.png"),
        ("1GxOZsWtfRxHCZ1BsYIHrtSwCS2bkV46T", "hab-17.png"),
        ("10ZIJb9Pi46euFGglTMoa_UtCsC91hCYQ", "hab-18.png"),
        ("1XYmVGYiN0mZyNBF5ZpxExuZoOyrMRuC7", "hab-19.png"),
        ("1nm03WqxPi5l6Vaa46CuUBhJzl4hhAH_1", "hab-20.png"),
    ],
    "history/assets": [
        ("1iofCUkg7HKckrQ3JSAp_NlZGd12Zb8Xj", "hab-01.png"),
        ("1RrFCVvqeAE0TT44nZdcD7dAoqKN7qSQI", "hab-02.png"),
        ("1LQt6jfWvbDO024rWHHoHX5dcqLj40Wyz", "hab-03.png"),
        ("1KTzhUoIrMB-5Vhux5kS3oKfQHLVmTBxL", "hab-04.png"),
        ("1AXEePNMplt5t7HD-mqu32OFTKVcVNv1t", "hab-05.png"),
        ("1wuw7Xy10A6uey-W6tkPl6STWGBqCWkPc", "hab-06.png"),
        ("1CAVDd87cz2ivgLWXw7v1ECDm2xhqxk7z", "hab-07.png"),
        ("1jIOc1vl6qWhdtnstCNt49zuXLtxy-Ioy", "hab-08.png"),
        ("1LN1lJpBV9UEXarThOLC6YPuU7v963ftw", "hab-09.png"),
    ],
}

def main():
    total = sum(len(v) for v in HOTELS.values())
    downloaded = 0
    failed = []

    for folder, files in HOTELS.items():
        dest_dir = os.path.join(BASE, folder)
        os.makedirs(dest_dir, exist_ok=True)
        print(f"\n📁 {folder} ({len(files)} imágenes)")

        for file_id, filename in files:
            dest = os.path.join(dest_dir, filename)
            if os.path.exists(dest):
                print(f"  ⏭  {filename} (ya existe)")
                downloaded += 1
                continue
            try:
                url = f"https://drive.google.com/uc?id={file_id}"
                gdown.download(url, dest, quiet=True)
                size_kb = os.path.getsize(dest) // 1024
                print(f"  ✅ {filename} ({size_kb}KB)")
                downloaded += 1
            except Exception as e:
                print(f"  ❌ {filename} — {e}")
                failed.append((folder, filename, file_id))

    print(f"\n{'='*50}")
    print(f"✅ Descargadas: {downloaded}/{total}")
    if failed:
        print(f"❌ Fallidas: {len(failed)}")
        for f in failed:
            print(f"   {f[0]}/{f[1]} (id: {f[2]})")
    print("\n¡Listo! Ahora Claude Code puede construir las webs.")

if __name__ == "__main__":
    main()
