import { supabase } from "./SupabaseConfig";
import { Product } from "@/types/product"

export async function createProduct(newProduct: Product): Promise<Product | null> {
  try {
    const { data, error } = await supabase
        .from('products')
        .insert([
          {
            user_id: newProduct.user_id,
            price: newProduct.price,
            name: newProduct.name,
            description: newProduct.description,
            image: newProduct.image,
          },
        ])
        .single();

    if (error) {
      console.error("Error creating product:", error.message);
      return null;
    }

    console.log("Product created successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error creating product:", err);
    return null;
  }
}

export async function getAllProducts(businessId?:string): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq("business_id", businessId)

    if (error) {
      console.error("Error fetching products:", error.message);
      return null;
    }

    console.log("Products fetched successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error fetching products:", err);
    return null;
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (error) {
      console.error("Error fetching product:", error.message);
      return null;
    }

    // console.log("Product fetched successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error fetching product:", err);
    return null;
  }
}

export async function updateProduct(updatedProduct: Product): Promise<Product | null> {
  try {
    const { data, error } = await supabase
        .from('products')
        .update({
          user_id: updatedProduct.user_id,
          price: updatedProduct.price,
          name: updatedProduct.name,
          description: updatedProduct.description,
          image: updatedProduct.image,
        })
        .eq('product_id', updatedProduct.product_id)
        .single();

    if (error) {
      console.error("Error updating product:", error.message);
      return null;
    }

    console.log("Product updated successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error updating product:", err);
    return null;
  }
}

export async function deleteProduct(productId: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', productId);

    if (error) {
      console.error("Error deleting product:", error.message);
      return false;
    }

    console.log("Product deleted successfully:", data);
    return true;
  } catch (err) {
    console.error("Unexpected error deleting product:", err);
    return false;
  }
}