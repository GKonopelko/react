### Before Optimization

| Operation              | Duration | Screnshot                                                    |
| ---------------------- | -------- | ------------------------------------------------------------ |
| Sorting by population  | 440ms    | ![alt text](./src/assets/performance-screnshots/image-3.png) |
| Searching a country    | 271ms    | ![alt text](./src/assets/performance-screnshots/image-4.png) |
| Selecting another year | 173ms    | ![alt text](./src/assets/performance-screnshots/image-5.png) |
| Removing columns       | 229ms    | ![alt text](./src/assets/performance-screnshots/image-7.png) |
| Adding columns         | 383ms    | ![alt text](./src/assets/performance-screnshots/image-6.png) |
| Filter by region       | 375ms    | ![alt text](./src/assets/performance-screnshots/image-8.png) |
| Change sort order      | 625ms    | ![alt text](./src/assets/performance-screnshots/image-9.png) |

Ranked chart ![alt text](./src/assets/performance-screnshots/image.png)
![alt text](./src/assets/performance-screnshots/image-1.png)

### After Optimization

| Operation              | Duration after (before) optimisation | Screnshot                                                          |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| Sorting by population  | 154 (440) ms                         | ![alt text](./src/assets/performance-screnshots/after-image.png)   |
| Searching a country    | 103 (271) ms                         | ![alt text](./src/assets/performance-screnshots/after-image-1.png) |
| Selecting another year | 136 (173) ms                         | ![alt text](./src/assets/performance-screnshots/after-image-2.png) |
| Removing columns       | 190 (229) ms                         | ![alt text](./src/assets/performance-screnshots/after-image-3.png) |
| Adding columns         | 192 (383) ms                         | ![alt text](./src/assets/performance-screnshots/after-image-4.png) |
| Filter by region       | 162 (375) ms                         | ![alt text](./src/assets/performance-screnshots/after-image-5.png) |
| Change sort order      | 153 (625) ms                         | ![alt text](./src/assets/performance-screnshots/after-image-6.png) |

Ranked chart ![alt text](./src/assets/performance-screnshots/after-image-7.png)
![alt text](./src/assets/performance-screnshots/after-image-8.png)
