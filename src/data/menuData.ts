export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: 1,
    name: "Coffee & Tea",
    items: [
      {
        id: 101,
        name: "Americano",
        description: "Smooth and bold black coffee made with espresso and hot water",
        price: 3.84,
        image: "/CoffeeTea/Americano.webp"
      },
      {
        id: 102,
        name: "Babyccino",
        description: "Steamed milk with a light frothy top, perfect for kids or a caffeine-free treat",
        price: 2.40,
        image: "/CoffeeTea/Babyccino.webp"
      },
      {
        id: 103,
        name: "Cappuccino",
        description: "A rich espresso topped with a thick layer of velvety foam",
        price: 4.44,
        image: "/CoffeeTea/Capuccino.webp"
      },
      {
        id: 104,
        name: "Chai Latte",
        description: "A comforting blend of spiced black tea and steamed milk, infused with cinnamon, cardamon and cloves for a warm aromatic flavour",
        price: 4.80,
        image: "/CoffeeTea/ChaiLatte.webp"
      },
      {
        id: 105,
        name: "Coffee Beans",
        description: "Our signature blend, crafted for a perfect balance of rich aroma. smooth body, and bold flavour. Expertly roasted to bring out deep, nuanced notes, delivering a premium coffee experience in every cup.",
        price: 21.60,
        image: "/CoffeeTea/CoffeeBeans.webp"
      },
      {
        id: 106,
        name: "Einspanner",
        description: "A Viennese-style double espresso topped with a generous layer of salted sweet cream cheese",
        price: 5.04,
        image: "/CoffeeTea/Einspanner.webp"
      },
      {
        id: 107,
        name: "Espresso",
        description: "A strong, smooth shot of rich coffee with a velvety crema, perfect on its own or as a base for other drinks",
        price: 3.60,
        image: "/CoffeeTea/Espresso.webp"
      },
      {
        id: 108,
        name: "Flat White",
        description: "A velvety smooth blend of espresso and steamed milk",
        price: 4.32,
        image: "/CoffeeTea/FlatWhite.webp"
      },
      {
        id: 109,
        name: "Glass of Milk",
        description: "Fresh, creamy and wholesome, served chilled for a smooth and refreshing taste",
        price: 1.20,
        image: "/CoffeeTea/Glass of Milk.webp"
      },
      {
        id: 110,
        name: "Jasmine Brew Tea",
        description: "Fragrant green tea infused with delicate jasmine blossoms, offering a smooth, floral aroma and a refreshing taste",
        price: 4.56,
        image: "/CoffeeTea/JasmineBrewTea.webp"
      },
      {
        id: 111,
        name: "Latte",
        description: "Creamy steamed milk poured over a shot of espresso, finished with light foam.",
        price: 4.44,
        image: "/CoffeeTea/Latte.webp"
      },
      {
        id: 112,
        name: "Mocha",
        description: "A luxurious blend of espresso, hot chocolate and steamed milk",
        price: 5.04,
        image: "/CoffeeTea/Mocha.webp"
      },
      {
        id: 113,
        name: "Macchiato",
        description: "A bold espresso \"stained\" with a touch of steamed milk",
        price: 4.44,
        image: "/CoffeeTea/Macchiato.webp"
      },
      {
        id: 114,
        name: "Mocaccino",
        description: "A delightful mix of espresso, a touch of steamed milk and rich chocolate",
        price: 4.56,
        image: "/CoffeeTea/Mocaccino.webp"
      },
      {
        id: 115,
        name: "Matcha Latte",
        description: "Earthy, antioxidant-rich matcha blended with steamed milk",
        price: 4.80,
        image: "/CoffeeTea/MatchaLatte.webp"
      },
      {
        id: 116,
        name: "Matcha Tea",
        description: "A vibrant, finely ground green tea packed with natural energy",
        price: 4.80,
        image: "/CoffeeTea/MatchaTea.webp"
      },
      {
        id: 117,
        name: "Tea",
        description: "A classic blend, perfect with or without milk, plus a selection of herbal options",
        price: 3.60,
        image: "/CoffeeTea/Tea.webp"
      }
    ]
  },
  {
    id: 2,
    name: "Bakery & Pastries",
    items: [
      {
        id: 201,
        name: "Muffin",
        description: "A soft and fluffy baked delight available in a variety of flavours",
        price: 4.32,
        image: "/Bakery/Muffin.webp"
      },
      {
        id: 202,
        name: "Scone",
        description: "A buttery, crumbly baked treat perfect on its own or with spreads",
        price: 4.32,
        image: "/Bakery/Scone.webp"
      },
      {
        id: 203,
        name: "Cinnamon Bum",
        description: "A soft swirled bun with warm cinnamon and sweet glaze",
        price: 4.32,
        image: "/Bakery/CinnamonBun.webp"
      },
      {
        id: 204,
        name: "Croissant",
        description: "A light flaky pastry with a crisp exterior and soft, buttery layers",
        price: 3.12,
        image: "/Bakery/Croissant.webp"
      },
      {
        id: 205,
        name: "Sausage Roll",
        description: "A flaky, golden pastry filled with seasoned sausage meat",
        price: 4.32,
        image: "/Bakery/SausageRoll.webp"
      }
    ]
  },
  {
    id: 3,
    name: "Breakfast and Brunch",
    items: [
      { id: 301, name: "Simply Morning", price: 9.60, description: "2 slices of French toast, decorated with mixed berries and strawberry mango jam", image: "/Breakfast/SimplyMorning.webp" },
      { id: 302, name: "Smoothie Bowl", price: 7.80, description: "A thick, refreshing blend of fruits topped with a variety of fresh fruit, granola and more. Made with milk and yoghurt", image: "/Breakfast/SmoothieBowl.webp" },
      { id: 303, name: "French Toast x 2", price: 7.80, description: "Classic golden-brown French toast, light crisp on the outside and soft on the inside", image: "/Breakfast/FrenchToast.webp" },
      { id: 304, name: "Bagel with Poached Egg and Bacon", price: 10.80, description: "Bagel, Poached Egg, Bacon, Avocado, Salad, Balsamic Dressing", image: "/Breakfast/PoachedEggBaconBagel.webp" },
      { id: 305, name: "Scrambled Egg Ciabatta", price: 10.80, description: "Ciabatta, Scrambled Eggs, Bacon, Fried Tomatoes, Peri-peri sauce", image: "/Breakfast/ScrambledEggCiabatta.webp" },
      { id: 306, name: "Hello Sunrise", price: 8.40, description: "Toasted Wholemeal Bread, Avocado, Salad, Poached Egg", image: "/Breakfast/EggToast.webp" },
      { id: 307, name: "Egg Toast", price: 7.80, description: "Toasted Wholemeal Bread, Tomato slices, Salad, Poached Egg", image: "/Breakfast/EggToast.webp" },
      { id: 308, name: "Porridge", price: 7.20, description: "Warm, creamy and nourishing, made with hearty oats and served with your choice of toppings for a comforting start to the day", image: "/Breakfast/Porridge.webp" },
      { id: 309, name: "Mixed Grain Energy Bowl", price: 12.00, description: "Mixed Grains, Beetroot, Apple, Add Poached Egg, Chicken or Mushrooms", image: "/Breakfast/SmoothieBowl.webp" },
      { id: 310, name: "Omelette Tortilla Bake", price: 12.00, description: "Tortilla, Scrambled Egg, Cottage Cheese, Choose your toppings", image: "/Breakfast/Omelette.webp" },
      { id: 311, name: "French Toast Benedict", price: 12.00, description: "Sourdough French Toast, Bacon Tomatoes, 2 Poached Eggs, Hollandaise Sauce, Crispy Onions", image: "/Breakfast/FrenchToastBenedict.webp" },
      { id: 312, name: "Cranberry Brie Toast", price: 7.80, description: "Toasted Sourdough Bread, Brie Cheese, Cranberry Sauce", image: "/Breakfast/CranberryBrieToast.webp" },
      { id: 313, name: "Salmon Sunrise", price: 9.60, description: "Bagel, Avocado, Salmon, Salads, Poached Egg, Topped Garlic Yoghurt and Balsamic Dressing", image: "/Breakfast/SalmonSunrise.webp" },
      { id: 314, name: "Almond Belgium Waffle (K) (GF)", price: 16.80, description: "Almond Flour Waffle, served with Chicken OR Smoked Salmon, Poached Egg, Lettuce and Cottage Cheese. Topped with Firecracker and Baconnaise Sauce Ketogenic, Gluten Free", image: "/Breakfast/AlmondBelgianWaffle.webp" },
      { id: 315, name: "Omelette (K) (GF)", price: 12.00, description: "Fluffy, made to order omelette with your choice of proteins, cheeses, fresh veggies and sauces. Ketogenic, Gluten Free", image: "/Breakfast/Omelette.webp" },
      { id: 316, name: "Mozzarella Omelette Sandwich (K) (GF)", price: 14.40, description: "Cream Cheese, Mozzarella, Egg, Avocado, Lettuce, Chicken or Smoked Salmon, Bacon, Mayo Ketogenic, Gluten Free", image: "/Breakfast/Omelette.webp" },
      { id: 317, name: "English Muffin", price: 10.20, description: "Sausage, Bacon, Cheese, Egg, Toasted Muffin", image: "/Breakfast/EnglishMuffin.webp" },
      { id: 318, name: "Good Morning Breakfast", price: 13.20, description: "Poached Egg, Sausages, Bacon, Beans, Mushrooms, Black Pudding, Tomato, Toasted Bread", image: "/Breakfast/GoodMorningBreakfast.webp" },
      { id: 319, name: "Acai Granola Bowl", price: 9.60, description: "Acai Granola Bowl topped with Banana, Berries & Whipped Cream", image: "/Breakfast/AcaiGranolaBowl.webp" }
    ]
  },
  {
    id: 4,
    name: "Lunch",
    items: [
      { id: 401, name: "Prosciutto Ham & Feta Cheese Baguette", price: 12.00, description: "Fresh baked Baguette topped with mayo, salads, cherry tomatoes, prosciutto Ham and Feta cheese. With a drizzle of balsamic glaze.", image: "/Lunch/ProsciuttoHamFetaCheeseBaguette.webp" },
      { id: 402, name: "Sourdough Pizza Slice", price: 12.00, description: "A Slice of Sourdough Pizza with your favourite toppings", image: "/Lunch/SourdoughPizza.webp" },
      { id: 403, name: "Black Jack Pulled Pork Burger Bun", price: 12.00, description: "Black Bun, Pulled Pork, Bacon, Mayo, Pickle, Cheese, Red Onion, Salad, Tomatoes Burger Sauce", image: "/Lunch/BlackJackBurger.webp" },
      { id: 404, name: "Goujons and Fries", price: 8.40, description: "3 x Air Fried Crispy Breaded Goujons served with Chips and Sauce of your Choice", image: "/Lunch/GoujonsFries.webp" },
      { id: 405, name: "Beetroot - Feta Burger", price: 10.80, description: "Pickled beetroot, Feta cheese, Apple slices, Balsamic dressing, Salad", image: "/Lunch/BeetrootFetaBurger.webp" },
      { id: 406, name: "Homemade Soup of the Day", price: 7.20, description: "Cauliflower, Peas and vegetables", image: "/Lunch/Soup.webp" },
      { id: 407, name: "Fishcake Mini Burger", price: 8.40, description: "Fishcake, Cheese, Tomato, Salads, Peri-peri and Mayo sauce", image: "/Lunch/FishCakeMiniBurger.webp" },
      { id: 408, name: "Chicken Goujons x 3", price: 6.00, description: "3 x Air Fried Crispy Breaded Goujons with Sauce of your Choice", image: "/Lunch/Goujons.webp" },
      { id: 409, name: "Poke Bowl", price: 14.40, description: "Choose: Chicken, Canned Tuna, Mushrooms, Smoked Salmon, Rice, Carrots, Avocado, Cucumber, Wakame, Sesame Oil, Nori, Ginger, Wasabi, Sesame Seeds", image: "/Lunch/PokeBowl.webp" },
      { id: 410, name: "Bibimbap", price: 14.40, description: "Choose: Chicken, Canned Tuna, Mushrooms, Smoked Salmon, Rice, Carrots, Avocado, Cucumber, Wakame, Sesame Oil, Nori, Ginger, Wasabi, Sesame Seeds", image: "/Lunch/Bibimbap.webp" },
      { id: 411, name: "Air Fried Sushi Hot Dog", price: 16.80, description: "Choose: Chicken, Canned Tuna, Mushrooms, Smoked Salmon, Rice, Carrots, Avocado, Cucumber, Wakame, Sesame Oil, Nori, Ginger, Wasabi, Sesame Seeds", image: "/Lunch/AirFriedSushiHotDog.webp" },
      { id: 412, name: "Beetroot Belgium Waffle", price: 14.40, description: "Cream cheese, Mozzarella, Egg Avocado, Lettuce, Chicken or Smoked Salmon, Bacon, Mayo", image: "/Lunch/BeetrootBelgianWaffle.webp" },
      { id: 413, name: "Crispy Chicken Naan Kebab", price: 14.40, description: "Chicken goujons, Chips, Coleslaw, Lettuce, Tomatoes, Onions, Garlic Yoghurt dressing and Teriyaki sauce", image: "/Lunch/CrispyChickenNaanKebab.webp" },
      { id: 414, name: "Festive Toastie", price: 10.80, description: "Slow cooked Beef, Bacon, Brie Cheese, Stuffing, Cranberry sauce, 2 slices of wholemeal bloomer, Mozzarella, Crispy Onions, BBQ", image: "/Lunch/FestiveToastie.webp" },
      { id: 415, name: "Ramen Soup", price: 12.00, description: "Sesame paste, Noodles, Chicken, Slow-cooked Beef, Carrots, Egg, Crispy Onions", image: "/Lunch/Ramen.webp" },
      { id: 416, name: "Meatball Pasta", price: 7.20, description: "Pasta, Meatballs and Tomato Sauce", image: "/Lunch/MeatballPasta.webp" },
      { id: 417, name: "Mexican Panini", price: 10.80, description: "Chicken, Mayo, Fried Peppers, Pickles, Cheese, Teriyaki sauce, Tabasco sauce", image: "/Lunch/MexicanPanini.webp" },
      { id: 418, name: "Jacket Potato", price: 12.00, description: "Baked Potato, Bacon, Cheese, Crispy onions, Peri-peri sauce, Salad", image: "/Lunch/JacketPotato.webp" },
      { id: 419, name: "Tortilla Omelette", price: 12.00, description: "Tortilla, Scrambled Egg, Cottage cheese, Choose your toppings", image: "/Lunch/OmeletteTortilla.webp" },
      { id: 420, name: "Chips", price: 3.60, description: "Crispy golden air fried chips", image: "/Lunch/Fries.webp" }
    ]
  },
  {
    id: 5,
    name: "Create Your Own",
    items: [
      { id: 501, name: "Sourdough Pizza Slice", price: 12.00, description: "A Slice of Sourdough Pizza with your favourite toppings", image: "/CreateYourOwn/PizzaBagel.webp" },
      { id: 502, name: "Create Your Own Quesadillas", price: 12.00, description: "Crispy tortilla filled with your choice of flavourful ingredients", image: "/CreateYourOwn/Quesadilla.webp" },
      { id: 503, name: "Create Your Own Bagel", price: 10.80, description: "Chewy and satisfying, toasted or fresh with a choice of delicious toppings", image: "/CreateYourOwn/Bagel.webp" },
      { id: 504, name: "Create Your Own Sandwich", price: 8.40, description: "Classic and customizable made with fresh bread and your choice of fillings", image: "/CreateYourOwn/Sandwich.webp" },
      { id: 505, name: "Create Your Own Taco", price: 13.20, description: "Soft shell filled with your choice of meats, veggies and toppings", image: "/CreateYourOwn/Taco.webp" },
      { id: 506, name: "Create Your Own Pizza Bagel", price: 10.80, description: "A bagel topped with rich tomato sauce, melted cheese and your favourite toppings", image: "/CreateYourOwn/PizzaBagel.webp" },
      { id: 507, name: "Create Your Own Toastie", price: 9.60, description: "Golden and crispy filled with your favourites and toasted to perfection", image: "/CreateYourOwn/Toastie.webp" },
      { id: 508, name: "Create Your Own Pasta", price: 13.20, description: "Classic and comforting cooked al-dente with your favourite sauces and add-ins", image: "/CreateYourOwn/Pasta.webp" },
      { id: 509, name: "Create Your Own Salad", price: 12.00, description: "Fresh, crisp and customizable with a variety of greens, veggies and toppings", image: "/CreateYourOwn/Salad.webp" },
      { id: 510, name: "Create Your Own Jacket Potato", price: 12.00, description: "A fluffy baked potato with crispy skin, loaded with your favourite toppings", image: "/CreateYourOwn/JacketPotato.webp" },
      { id: 511, name: "Create Your Own Wrap", price: 10.80, description: "Soft tortilla packed with fresh ingredients rolled for a perfect handheld meal", image: "/CreateYourOwn/Wrap.webp" },
      { id: 512, name: "Create Your Own Panini", price: 10.80, description: "Grilled to perfection with a crispy crust and melty flavourful fillings", image: "/CreateYourOwn/Panini.webp" },
      { id: 513, name: "Create Your Own Crepe (savoury)", price: 12.00, description: "Thin and delicate, served with savoury fillings to suit your taste", image: "/CreateYourOwn/Crepe(Savory).webp" },
      { id: 514, name: "Create Your Own Chips", price: 12.00, description: "Crispy, golden air fried chips", image: "/CreateYourOwn/Chips.webp" },
      { id: 515, name: "Create Your Own Pizza Quesadilla", price: 12.00, description: "A fusion of pizza and quesadilla made with a crispy wrap base layered with tomato sauce, melted cheese and your choice of toppings", image: "/CreateYourOwn/PizzaQuesedilla.webp" },
      { id: 516, name: "Create Your Own Omelette (K) (GF)", price: 12.00, description: "Light and fluffy eggs, cooked to perfection with your choice of fillings, ketogenic, gluten free", image: "/CreateYourOwn/Omelette.webp" },
      { id: 517, name: "Create Your Own Omelette Tortilla Bake", price: 12.00, description: "Tortilla, Scrambled Egg, Cottage Cheese, Choose your toppings", image: "/CreateYourOwn/OmeletteTortilla.webp" },
      { id: 518, name: "Create Your Own Rice", price: 12.00, description: "Rice with fresh ingredients and your own toppings", image: "/CreateYourOwn/Rice.webp" },
      { id: 519, name: "Create Your Own Ciabatta", price: 10.80, description: "A rustic ciabatta served fresh or toasted. Choose your toppings to make it your own", image: "/CreateYourOwn/Ciabatta.webp" }
    ]
  },
  {
    id: 6,
    name: "Salads",
    items: [
      { id: 601, name: "Caesar Salad", price: 12.00, description: "Crisp iceberg lettuce and salad mix tossed, homemade caesar dressing, onions, chicken, bacon, grated mozzarella, tomatoes, roasted almonds, parmesan", image: "/Salads/CaesarSalad.webp" },
      { id: 602, name: "Greek Salad", price: 12.00, description: "A refreshing mix of tomatoes, cucumbers, red onions, olives, feta cheese, parmesan, walnuts, balsamic dressing", image: "/Salads/GreekSalad.webp" },
      { id: 603, name: "Burrata/Mozzarella and Mango Salad", price: 12.00, description: "Creamy burrata/mozzarella paired with fresh greens, mango and sweet mango sauce and a drizzle of balsamic glaze", image: "/Salads/MozzarellaMangoSalad.webp" },
      { id: 604, name: "Caprese Salad", price: 12.00, description: "Sliced fresh mozzarella, tomatoes, basil, prosciutto ham finished with extra virgin olive oil and balsamic dressing", image: "/Salads/CapreseSalad.webp" },
      { id: 605, name: "Balsamic Mozzarella Salad", price: 12.00, description: "A light and flavourful combination of mixed greens, cherry tomatoes, mozzarella, balsamic sauce and mix seeds", image: "/Salads/BalsamicMozzarellaSalad.webp" },
      { id: 606, name: "Crispy Chicken Salad", price: 12.00, description: "A hearty salad with crispy chicken goujons, fresh vegetables and choice of dressing", image: "/Salads/CrispyChickenSalad.webp" },
      { id: 607, name: "Create Your Own Salad", price: 12.00, description: "Build your perfect salad by choosing from a variety of fresh toppings and dressings", image: "/Salads/CreateyourownSalad.webp" }
    ]
  },
  {
    id: 7,
    name: "Keto, Vegan and Gluten Free",
    items: [
      { id: 701, name: "Omelette (K) (GF)", price: 12.00, description: "Fluffy made to order omelette with your choice of proteins, cheeses, fresh veggies and sauces. Ketogenic Gluten free", image: "/Keto/Omelette.webp" },
      { id: 702, name: "Almond Belgium Waffle (K) (GF)", price: 16.80, description: "Almond Flour Waffle served with chicken or Smoked Salmon, Poached Egg, Lettuce and Cottage cheese. Topped with Firecracker and Baconnaise Sauce Ketogenic, Gluten Free", image: "/Keto/AlmondBelgianWaffle.webp" },
      { id: 703, name: "Mozzarella Omelette Sandwich (K) (GF)", price: 14.40, description: "Cream cheese, Mozzarella, Egg, Avocado, Lettuce, Chicken or Smoked Salmon, Bacon, Mayo Ketagenic, Gluten Free", image: "/Keto/MozzarellaOmeletteSandwich.webp" },
      { id: 704, name: "Bagel (GF) (V)", price: 12.00, description: "A chewy and satisfying gluten-free bagel ready to be topped with your favourite ingredients", image: "/Keto/Bagel.webp" },
      { id: 705, name: "Chocolate Fudge Cake (GF)", price: 5.76, description: "A rich and dense gluten free chocolate are with a smooth fudge topping", image: "/Keto/ChocolateFudgeCake(GF).webp" },
      { id: 706, name: "Creamy Almond Coffee Dream (K)", price: 7.20, description: "A cold and creamy coffee made with almond milk, vanilla frappe powder and topped with a rich cream cheese finish. Ketogenic" },
      { id: 707, name: "Egg Coffee (K)", price: 5.40, description: "Americano coffee topped with cream made from Egg Yolk, Whipping Cream, Zero Carbs Syrup Ketogenic" },
      { id: 708, name: "Macaroon (GF)", price: 3.00, description: "Delicate almond -based cookies with a crisp shell and soft centre. Gluten-free", image: "/Keto/Macroons.webp" },
      { id: 709, name: "Muffin (GF)", price: 4.80, description: "A delicious Gluten-free muffin , plain", image: "/Keto/Muffin.webp" },
      { id: 710, name: "Sandwich (GF) (V)", price: 10.20, description: "A delicious gluten-free sandwich, choose your toppings", image: "/Keto/VeganSandwich.webp" },
      { id: 711, name: "Scone", price: 5.04, description: "A crumbly and buttery gluten-free scone perfect with jam and cream, or enjoyed on its own", image: "/Keto/Scone.webp" },
      { id: 712, name: "Sushi Bowl (GF) (K)", price: 14.40, description: "Smoked Salmon or Chicken Or Tuna. Egg, Cream Cheese, Mayo, Mozzarella, Cucumber, Avocado, Goma Wakame Salads. Topped with Crispy Onions, Sesame seeds. Ketogenic, Gluten free", image: "/Keto/SushiBowl.webp" },
      { id: 713, name: "Toastie (GF) (V)", price: 10.20, description: "A delicious gluten-free toastie, choose your toppings", image: "/Keto/VeganToastie.webp" },
      { id: 714, name: "Snickers / Toblerone Cake (GF)", price: 5.52, description: "A decadent gluten-free dessert featuring the signature honey and almond nougat flavours of Toblerone chocolate", image: "/Keto/SnickersCake.webp" },
      { id: 715, name: "Vegan Burger (GF) (V)", price: 12.00, description: "A hearty plant-based patty served in a bun with fresh toppings and a choice of sauce. Gluten-free", image: "/Keto/VeganBurger.webp" },
      { id: 716, name: "Vegan Kiev (GF) (V)", price: 14.40, description: "A crispy golden plant-based kiev filled with a creamy garlic and herb centre served with chips. Gluten-free", image: "/Keto/VeganKiev.webp" },
      { id: 717, name: "Vegan Suasages (GF) (V)", price: 9.60, description: "Deliciously seasoned plant-based sausages served on a bap with fresh greens and vegetables. Gluten-free", image: "/Keto/VeganSausageBap.webp" },
      { id: 718, name: "Vegan Taco(GF) (V)", price: 15.60, description: "A soft taco shell filled with vibrant plant-based mince, sweetcorn, tomato, salsa and flavourful seasonings. Gluten-free", image: "/Keto/VeganTaco.webp" }
    ]
  },
  {
    id: 8,
    name: "Cakes, Cookies & Bites",
    items: [
      {
        id: 801,
        name: "Black Forest Gateaux",
        description: "Layers of rich chocolate sponge, fresh cream and juicy cherries topped with chocolate shavings",
        price: 5.16,
        image: "/Cakes/BlackForestGateaux.webp"
      },
      {
        id: 802,
        name: "Belgium Caramel Squares",
        description: "A thick caramel layer sandwiched between a buttery biscuit base and rich chocolate topping",
        price: 4.20,
        image: "/Cakes/CaramelSquare.webp"
      },
      {
        id: 803,
        name: "Brownie",
        description: "A dense and fudgy chocolate brownie with a rich gooey centre",
        price: 5.16,
        image: "/Cakes/Brownie.webp"
      },
      {
        id: 804,
        name: "Rainbow Cake",
        description: "Vibrant layers of vanilla sponge with a light and fluffy buttercream creating a colourful treat",
        price: 5.40,
        image: "/Cakes/RainbowCake.webp"
      },
      {
        id: 805,
        name: "Chocolate Cake",
        description: "A decadent moist chocolate sponge layered with silky chocolate frosting",
        price: 5.16,
        image: "/Cakes/ChocolateCake.webp"
      },
      {
        id: 806,
        name: "Biscoff Rocky Road",
        description: "A crunchy chewy mix of Biscoff biscuits, marshmallow and chocolate, finished with a drizzle of caramel",
        price: 4.20,
        image: "/Cakes/Biscoff Rocky Road.webp"
      },
      {
        id: 807,
        name: "Coffee Cake",
        description: "A lightly spiced cake with a subtle coffee flavour topped with a crunchy streusel",
        price: 5.16,
        image: "/Cakes/CoffeeCake.webp"
      },
      {
        id: 808,
        name: "Chocolate Fudge Cake (GF)",
        description: "A rich and dense gluten-free chocolate cake with a smooth fudge topping",
        price: 5.76,
        image: "/Cakes/ChocolateFudgeCake(GF).webp"
      },
      {
        id: 809,
        name: "Red Velvet",
        description: "A soft and velvety cocoa sponge with layers of smooth cream cheese frosting",
        price: 5.16,
        image: "/Cakes/RedVelvet.webp"
      },
      {
        id: 810,
        name: "Lemon Meringue",
        description: "A crisp pastry shell filled with tangy lemon curd topped with fluffy toasted meringue",
        price: 5.16,
        image: "/Cakes/LemonMeringue.webp"
      },
      {
        id: 811,
        name: "Protein balls",
        description: "A nutritious energy-packed snack made with coconut, oats, honey, peanut butter, cinnamon, protein powder",
        price: 3.00,
        image: "/Cakes/ProteinBalls.webp"
      },
      {
        id: 812,
        name: "Carrot Cake",
        description: "A moist spiced cake with grated carrots and walnuts layered with smooth cream cheese frosting",
        price: 5.16,
        image: "/Cakes/CarrotCake.webp"
      },
      {
        id: 813,
        name: "Tiramisu",
        description: "Layers of espresso-soaked sponge and mascarpone cream finished with a dusting of cocoa",
        price: 5.52,
        image: "/Cakes/Tiramisu.webp"
      },
      {
        id: 814,
        name: "Chocolate Orange Cake",
        description: "A moist chocolate sponge infused with zesty orange and topped with a smooth chocolate ganache",
        price: 5.16,
        image: "/Cakes/ChocolateOrangeCake.webp"
      },
      {
        id: 815,
        name: "Peanut Butter Snickers Cake",
        description: "A rich peanut butter cake loaded with caramel, chocolate and crunchy peanuts",
        price: 5.76,
        image: "/Cakes/PeanutSnickerCake.webp"
      },
      {
        id: 816,
        name: "Crumble Cookie",
        description: "A soft and chewy cookie with a crisp crumbly topping",
        price: 4.80,
        image: "/Cakes/CrumbleCookie.webp"
      },
      {
        id: 817,
        name: "Amaretto Cake",
        description: "A moist nutty almond cake infused with a touch of amaretto for a delicate, aromatic flavouring",
        price: 5.16,
        image: "/Cakes/AmarettoCheesecake.webp"
      },
      {
        id: 818,
        name: "Apple Pie",
        description: "A buttery flaky crust filled with spiced apples, baked to golden perfection",
        price: 5.16,
        image: "/Cakes/StrawberryApplePie.webp"
      },
      {
        id: 819,
        name: "Dubai Chocolate",
        description: "Crunchy toasted kataifi pastry filled with pistachio cream and tahini, coated in rich chocolate",
        price: 4.80,
        image: "/Cakes/DubaiChocolate.webp"
      },
      {
        id: 820,
        name: "Zesty Lemon Cake",
        description: "A light citrus-infused sponge cake topped with a tangy lemon glaze",
        price: 5.16,
        image: "/Cakes/ZestyLemonCake.webp"
      }
    ]
  },
  {
    id: 10,
    name: "Gourmet Lattes",
    items: [
      {
        id: 1001,
        name: "Coconut Kiss Latte",
        description: "A smooth and creamy latte infused with a hint of coconut for a tropical twist",
        price: 5.04,
        image: "/GourmetLatte/CoconutKissLatte.webp"
      },
      {
        id: 1002,
        name: "Tiramisu Latte",
        description: "A latte inspired by the classical Italian dessert",
        price: 5.04,
        image: "/GourmetLatte/TiramisuLatte.webp"
      },
      {
        id: 1003,
        name: "Beetroot Latte",
        description: "A smooth and earthy latte with the healthy addition of beetroot creating a unique and vibrant coffee",
        price: 5.04,
        image: "/GourmetLatte/BeetrootLatte(Decaf).webp"
      },
      {
        id: 1004,
        name: "Strawberry Latte",
        description: "A light and fruit strawberry-flavoured hot milky drink offering a sweet refreshing twist on the classic",
        price: 5.04,
        image: "/GourmetLatte/StrawberryLatte(Decaf).webp"
      },
      {
        id: 1005,
        name: "Banana Latte",
        description: "A sweet and creamy latter infused with the natural flavour of ripe banana for a smooth fruity coffee experience",
        price: 5.04,
        image: "/GourmetLatte/BananaLatte.webp"
      },
      {
        id: 1006,
        name: "Blue Lagoon Latte",
        description: "A tropical latte with vibrant blue curacao syrup, bringing a refreshing and energizing twist",
        price: 5.04,
        image: "/GourmetLatte/BlueLagoonLatte.webp"
      },
      {
        id: 1007,
        name: "Creme Brulee Latte",
        description: "A latte with the rich flavours of vanilla and caramel, topped with a crunchy caramelized sugar finish for a dessert-like treat",
        price: 5.40,
        image: "/GourmetLatte/CremeBruleeLatte.webp"
      },
      {
        id: 1008,
        name: "Ice-cream Espresso Latte",
        description: "A refreshing coffee blend with tropical coconut and lychee flavours perfect for a bright fruity twist",
        price: 5.40,
        image: "/GourmetLatte/Ice-CreamEspresso.webp"
      },
      {
        id: 1009,
        name: "Coconut Coffee Lychee Blend Latte",
        description: "A refreshing coffee blend with tropical coconut and lychee flavours, perfect for a bright fruity twist",
        price: 6.60,
        image: "/GourmetLatte/CoconutCoffeeLycheeBlend.webp"
      },
      {
        id: 1010,
        name: "Cream Panner Latte",
        description: "A smooth and creamy iced drink featuring coffee cubes that slowly melt into rich milk and Irish cream syrup, finished with a layer of cream cheese",
        price: 6.00,
        image: "/GourmetLatte/CreamPanner.webp"
      },
      {
        id: 1011,
        name: "Creamy Coconut Coffee Dream Latte",
        description: "A smooth and creamy coffee blend with tropical coconut flavour topped up with salted sweet cream cheese",
        price: 6.60,
        image: "/GourmetLatte/CreamyCoconutCoffeeDream.webp"
      },
      {
        id: 1012,
        name: "Hot Chocolate",
        description: "A rich velvety hot chocolate topped with fluffy marshmallows and whipped cream for a cosy indulgence",
        price: 5.40,
        image: "/GourmetLatte/HotChocolate.webp"
      },
      {
        id: 1013,
        name: "Kinder Bueno Latte",
        description: "A rich and creamy latte with the indulgent flavours of Kinder Bueno including a touch of hazelnut syrup",
        price: 6.00,
        image: "/GourmetLatte/KinderBeunoLatte.webp"
      },
      {
        id: 1014,
        name: "Lotus Biscoff Latte",
        description: "A spiced and sweet latte with the distinctive flavour of Lotus Biscoff cookies creating a decadent coffee experience",
        price: 6.00,
        image: "/GourmetLatte/LotusBiscoffLatte.webp"
      },
      {
        id: 1015,
        name: "Panda Latte",
        description: "A bold black and white iced latte with smooth coconut and a rich cream cheese topping",
        price: 6.60,
        image: "/GourmetLatte/Panda.webp"
      },
      {
        id: 1016,
        name: "Peanut Butter Latte",
        description: "A smooth and nutty lace with a generous infusion of peanut butter perfect for a cosy sweet treat",
        price: 6.00,
        image: "/GourmetLatte/PeanutButterLatte.webp"
      },
      {
        id: 1017,
        name: "Pistachio Latte",
        description: "A creamy and aromatic pistachio-flavoured latter offering a nutty and indulgent experience",
        price: 6.60,
        image: "/GourmetLatte/PistachioLatte.webp"
      }
    ]
  },
  {
    id: 11,
    name: "Signature Drinks",
    items: [
      {
        id: 1101,
        name: "Lychee Mojito (Virgin)",
        description: "A tropical non-alcoholic mojito with lychee offering a refreshing and fruity flavour",
        price: 5.40,
        image: "/SignatureDrinks/LycheeMojito(Virgin).webp"
      },
      {
        id: 1102,
        name: "Cherry Velvet Sip",
        description: "A smooth and refreshing drink with a rich cherry flavour served still or sparkling",
        price: 5.40,
        image: "/SignatureDrinks/CherryVelvetSip.webp"
      },
      {
        id: 1103,
        name: "Fruit Tea",
        description: "Refreshing, fruity and lightly sweetened tea served iced or hot. Enjoy still or sparkling with or without boba",
        price: 5.40,
        image: "/SignatureDrinks/RaspberryFruitTea.webp"
      },
      {
        id: 1104,
        name: "Green Oasis",
        description: "A vibrant and refreshing drink with a bold tropical twist. Includes Apple Jellies",
        price: 5.40,
        image: "/SignatureDrinks/GreenOasis.webp"
      },
      {
        id: 1105,
        name: "Milk Tea",
        description: "Smooth creamy tea with rich flavours, served hot or iced. Enjoy it plain or with boba pearls",
        price: 4.80,
        image: "/SignatureDrinks/CaramelMilkTea.webp"
      },
      {
        id: 1106,
        name: "Passion Fruit Mojito (Virgin)",
        description: "A vibrant virgin mojito featuring the tangy taste of passion fruit for a refreshing fruity twist",
        price: 5.40,
        image: "/SignatureDrinks/PassionFruitMojito(Virgin).webp"
      }
    ]
  },
  {
    id: 12,
    name: "Hot Desserts",
    items: [
      {
        id: 1201,
        name: "Crepe (Sweet)",
        description: "Thin, delicate and buttery, our crepes are the perfect canvas for a variety of sweet or savoury fillings, creating a deliciously satisfying experience with every bite",
        price: 9.60,
        image: "/HotDesserts/Crepe.webp"
      },
      {
        id: 1202,
        name: "American Pancakes",
        description: "Thick, soft and perfectly fluffy, these classic pancakes are stacked high and served warm offering a comforting and indulgent treat with every bite.",
        price: 10.80,
        image: "/HotDesserts/AmericanPancakes.webp"
      },
      {
        id: 1203,
        name: "Golden Toast",
        description: "A deliciously indulgent treat with thick slices of toasted bread, crispy on the outside and soft inside, offering an unique and satisfying flavour experience. Perfect for anyone with a sweet tooth.",
        price: 18.00,
        image: "/HotDesserts/GoldenToast.webp"
      },
      {
        id: 1204,
        name: "Bubble Waffle",
        description: "A fun twist on the classic waffle, this crispy bubble-shaped treat is light, fluffy and perfect for holding your choice of toppings, offering a delightful mix textures and flavours",
        price: 12.00,
        image: "/HotDesserts/BubbleWaffle.webp"
      },
      {
        id: 1205,
        name: "Souffle Pancake",
        description: "Fluffy, airy and melt-in-your-mouth delicious. These Japanese-style souffle pancakes are a light yet indulgent treat served warm and perfect for anyone craving a sweet pillowy delight",
        price: 13.20,
        image: "/HotDesserts/SoufflePancakes.webp"
      },
      {
        id: 1206,
        name: "Belgian Waffle",
        description: "Crispy on the outside, light and airy on the inside, these golden waffles are the perfect balance of texture, making them the ultimate indulgence when paired with your favourite toppings",
        price: 12.00,
        image: "/HotDesserts/BelgianWaffle.webp"
      }
    ]
  },
  {
    id: 13,
    name: "Beverages",
    items: [
      {
        id: 1301,
        name: "Sprite",
        description: "330ml",
        price: 2.40,
        image: "/Beverages/Sprite.webp"
      },
      {
        id: 1302,
        name: "Coke",
        description: "330ml",
        price: 2.40,
        image: "/Beverages/Coke.webp"
      },
      {
        id: 1303,
        name: "Coke Zero",
        description: "330ml",
        price: 2.40,
        image: "/Beverages/CokeZero.webp"
      },
      {
        id: 1304,
        name: "Diet Coke",
        description: "330ml",
        price: 2.40,
        image: "/Beverages/DietCoke.webp"
      },
      {
        id: 1305,
        name: "Fruit Shoot",
        description: "200ml",
        price: 2.40,
        image: "/Beverages/Fruit%20Shoot.webp"
      },
      {
        id: 1306,
        name: "Fanta Orange",
        description: "330ml",
        price: 2.40,
        image: "/Beverages/Fanta.webp"
      },
      {
        id: 1307,
        name: "Still Water",
        description: "500ml",
        price: 2.40,
        image: "/Beverages/StillWater.webp"
      },
      {
        id: 1308,
        name: "Vit-Hit",
        description: "500ml",
        price: 3.12,
        image: "/Beverages/VitHit.webp"
      },
      {
        id: 1309,
        name: "Capri Sun Orange",
        description: "330ml",
        price: 1.92,
        image: "/Beverages/CapriSun.webp"
      },
      {
        id: 1310,
        name: "Sparkling Water",
        description: "500ml",
        price: 2.40,
        image: "/Beverages/SparklingWater.webp"
      }
    ]
  }
];

export const sushiData: MenuItem[] = [
  {
    id: 1401,
    name: "California Roll (8 pcs)",
    description: "Crab, avocado and cucumber rolled in sushi rice and seaweed",
    price: 8.95,
    image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 1402,
    name: "Salmon Nigiri (4 pcs)",
    description: "Fresh salmon slices on hand-pressed sushi rice",
    price: 9.50,
    image: "https://images.pexels.com/photos/8252816/pexels-photo-8252816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 1403,
    name: "Spicy Tuna Roll (8 pcs)",
    description: "Spicy tuna mixed with sauce and vegetables",
    price: 10.95,
    image: "https://images.pexels.com/photos/3620705/pexels-photo-3620705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 1404,
    name: "Dragon Roll (8 pcs)",
    description: "Eel and cucumber inside, avocado and eel sauce on top",
    price: 13.95,
    image: "https://images.pexels.com/photos/8252743/pexels-photo-8252743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 1405,
    name: "Vegetarian Roll (8 pcs)",
    description: "Avocado, cucumber, carrot and lettuce",
    price: 7.95,
    image: "https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 1406,
    name: "Sushi Platter (20 pcs)",
    description: "Chef's selection of nigiri and maki rolls",
    price: 24.95,
    image: "https://images.pexels.com/photos/2133989/pexels-photo-2133989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];
