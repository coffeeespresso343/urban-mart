import { PackageX, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useProductsStore } from "../../hooks/useProductsStore";
import EmptyState from "../../components/ui/EmptyState";
import { useEffect, useState, type FormEvent } from "react";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import Badge, { BadgeIcon } from "../../components/ui/Badge";
import { formatPrice } from "../../utils/currency";
import { AdminProductsSkeleton } from "../../components/ui/Skeleton";
import type {
  Product,
  ProductBadge,
  ProductCategory,
} from "../../types/Product";
import {
  createProduct,
  deleteProduct,
  nextProductId,
  updateProduct,
} from "../../lib/products";
import { useUIStore } from "../../hooks/uiStore";
import Modal from "../../components/ui/Modal";
import { categories } from "../../data/categories";
import { CheckboxField, TextField } from "../../components/admin/ProductInput";
import { Link } from "react-router-dom";
import ImageUploadField, {
  type ImagePreviewItem,
} from "../../components/admin/ImageUploadField";
import { uploadProductImages } from "../../lib/storage";

const BADGE_OPTIONS: (ProductBadge | "None")[] = [
  "None",
  "New",
  "Best Seller",
  "Limited",
];

interface FormState {
  name: string;
  sku: string;
  category: ProductCategory;
  price: string;
  compareAtPrice: string;
  description: string;
  stock: string;
  images: string[];
  colors: string;
  tags: string;
  badge: ProductBadge | "None";
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
}

const emptyForm = (defaultCategory: ProductCategory): FormState => ({
  name: "",
  sku: "",
  category: defaultCategory,
  price: "",
  compareAtPrice: "",
  description: "",
  stock: "0",
  images: [],
  colors: "",
  tags: "",
  badge: "None",
  featured: false,
  isNew: false,
  bestSeller: false,
});

const productToForm = (product: Product): FormState => ({
  name: product.name,
  sku: product.sku,
  category: product.category,
  price: String(product.price),
  compareAtPrice:
    product.compareAtPrice !== undefined ? String(product.compareAtPrice) : "",
  description: product.description,
  stock: String(product.stock),
  images: [...product.images],
  colors: (product.colors ?? []).join(", "),
  tags: product.tags.join(", "),
  badge: (product.badge as ProductBadge | undefined) ?? "None",
  featured: Boolean(product.featured),
  isNew: Boolean(product.isNew),
  bestSeller: Boolean(product.bestSeller),
});

const AdminProducts = () => {
  const showToast = useUIStore((s) => s.showToast);
  const { products, isLoading, refetch } = useProductsStore();

  useEffect(() => {
    void refetch();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(categories[0].name));
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openCreate = () => {
    setEditingProduct(null);

    setForm(emptyForm(categories[0].name));
    setPendingFiles([]);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm(productToForm(product));
    setPendingFiles([]);
    setModalOpen(true);
  };

  const imagePreviews: ImagePreviewItem[] = [
    ...form.images.map((url) => ({
      key: url,
      src: url,
      onRemove: () =>
        setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) })),
    })),

    ...pendingFiles.map((file, index) => ({
      key: `pending-${index}-${file.name}`,
      src: URL.createObjectURL(file),
      onRemove: () =>
        setPendingFiles((prev) => prev.filter((_, i) => i !== index)),
    })),
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const parsedPrice = Number(form.price);
    const parsedComparAt = form.compareAtPrice.trim()
      ? Number(form.compareAtPrice)
      : undefined;
    const parsedStock = Number(form.stock) || 0;

    if (
      !form.name.trim() ||
      !form.sku.trim() ||
      !Number.isFinite(parsedPrice)
    ) {
      showToast("Name, SKU, and a valid price are required.", "error");
      setIsSaving(false);
      return;
    }

    const productId = editingProduct?.id ?? nextProductId(products);

    let uploadedUrls: string[] = [];
    if (pendingFiles.length > 0) {
      const { urls, error: uploadError } = await uploadProductImages(
        pendingFiles,
        productId,
      );

      if (uploadError) {
        showToast(uploadError, "error");
        setIsSaving(false);
        return;
      }
      uploadedUrls = urls;
    }

    const finalImages = [...form.images, ...uploadedUrls];
    if (finalImages.length === 0) {
      showToast("At least one product image is required", "error");
      setIsSaving(false);
      return;
    }

    const payload: Product = {
      id: productId,
      sku: form.sku.trim(),
      name: form.name.trim(),
      category: form.category,
      price: parsedPrice,
      compareAtPrice: parsedComparAt,
      description: form.description.trim(),
      details: editingProduct?.details ?? [],
      images: finalImages,
      rating: editingProduct?.rating ?? 0,
      reviewCount: editingProduct?.reviewCount ?? 0,
      stock: parsedStock,
      badge: form.badge === "None" ? undefined : form.badge,
      colors: form.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.featured,
      isNew: form.isNew,
      bestSeller: form.bestSeller,
    };

    const { error } = editingProduct
      ? await updateProduct(payload.id, payload)
      : await createProduct(payload);

    setIsSaving(false);

    if (error) {
      showToast(error, "error");
      return;
    }

    showToast(
      editingProduct ? "Product updated" : "Product created",
      "success",
    );
    void refetch();
    setModalOpen(false);

    return;
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`))
      return;

    setDeletingId(product.id);
    const { error } = await deleteProduct(product.id);
    setDeletingId(null);

    if (error) {
      showToast(error, "error");
      return;
    }

    showToast("Product deleted", "success");
    void refetch();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-display font-bold tracking-tight">
              Products
            </h2>
            <p className="mt-1 text-sm text-stone">({products.length})</p>
          </div>
          <p className="mt-1 text-sm text-stone">Manage products.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-6">
          <AdminProductsSkeleton count={8} />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={PackageX}
          title="No Prducts Yet"
          message="Add your first product to get started."
        />
      ) : (
        <div className="mt-6 divide-y divide-line-light border-y border-line-light">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div className="flex items-center gap-2 lg:gap-5">
                <span className="bg-stone/40 text-ink text-[10px] h-4 w-4 flex items-center justify-center rounded-full">
                  {product.id}
                </span>

                <Link
                  to={`/product/${product.id}`}
                  className="relative h-14 w-14 rounded-xl shrink-0 overflow-hidden bg-paper-dim hover:opacity-90 active:scale-95"
                >
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  {product.badge ? (
                    <div className="absolute -right-0.5 -top-0.5 lg:hidden">
                      <BadgeIcon badge={product.badge} tone="stone" />
                    </div>
                  ) : null}
                </Link>
                <div className="min-w-0">
                  <div className="flex items-start flex-col-reverse lg:flex-row gap-1 lg:gap-3">
                    <p className="text-sm max-w-40 lg:min-w-70 font-medium">
                      {product.name}
                    </p>
                    <span className="hidden lg:block">
                      {product.badge ? (
                        <Badge tone="stone" className="text-[10px]">
                          {product.badge}
                        </Badge>
                      ) : null}
                    </span>
                  </div>
                  <div className="mt-1 label-tag flex flex-col lg:items-center lg:flex-row lg:gap-2 text-stone lg:mt-2">
                    <p>{product.category}</p>
                    <span className="hidden text-stone/80 lg:block">.</span>
                    <p className="text-ink text-[10px]">
                      Stock {product.stock}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 lg:gap-10">
                <span className="price text-sm font-semibold">
                  {formatPrice(product.price)}
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="text-stone transition-colors duration-200 hover:text-ink active:scale-[0.95]"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  disabled={product.id === deletingId}
                  className="text-error transition-colors duration-200 hover:text-ink active:scale-[0.95] disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={editingProduct ? "Edit Product" : "Add Product"}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex max-h-[70vh] flex-col gap-4 scrollbar-none overflow-y-auto pr-1"
            >
              <div className="mt-2 grid grid-cols-2 gap-2">
                <TextField
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  placeholder="Product name"
                  required
                />
                <TextField
                  label="SKU"
                  value={form.sku}
                  onChange={(v) => setForm({ ...form, sku: v })}
                  placeholder="UM-SKU-000"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-category"
                  className="label-tag text-stone"
                >
                  Category
                </label>
                <select
                  id="admin-category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as ProductCategory,
                    })
                  }
                  className="border border-line-light rounded-lg
                bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                >
                  {categories.map((cat) => (
                    <option key={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <TextField
                  label="Price ($)"
                  value={form.price}
                  onChange={(v) => setForm({ ...form, price: v })}
                  required
                  inputMode="decimal"
                />
                <TextField
                  label="Compare-at"
                  value={form.compareAtPrice}
                  onChange={(v) => setForm({ ...form, compareAtPrice: v })}
                  inputMode="decimal"
                />
                <TextField
                  label="Stock"
                  value={form.stock}
                  onChange={(v) => setForm({ ...form, stock: v })}
                  required
                  inputMode="numeric"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-description"
                  className="label-tag text-stone"
                >
                  Description
                </label>
                <textarea
                  id="admin-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="rounded-lg border border-line-light bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>
              <ImageUploadField
                previews={imagePreviews}
                onFilesSelected={(files) =>
                  setPendingFiles((prev) => [...prev, ...files])
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label="Colors"
                  value={form.colors}
                  onChange={(v) => setForm({ ...form, colors: v })}
                />
                <TextField
                  label="Tags"
                  value={form.tags}
                  onChange={(v) => setForm({ ...form, tags: v })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="admin-badge" className="label-tag text-stone">
                  Badge
                </label>
                <select
                  id="admin-badge"
                  value={form.badge}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      badge: e.target.value as ProductBadge | "None",
                    })
                  }
                  className="border border-line-light rounded-lg
                bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
                >
                  {BADGE_OPTIONS.map((badge) => (
                    <option key={badge} value={badge}>
                      {badge}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-4">
                <CheckboxField
                  label="Featured"
                  checked={form.featured}
                  onChange={(v) => setForm({ ...form, featured: v })}
                />
                <CheckboxField
                  label="New"
                  checked={form.isNew}
                  onChange={(v) => setForm({ ...form, isNew: v })}
                />
                <CheckboxField
                  label="Best Seller"
                  checked={form.bestSeller}
                  onChange={(v) => setForm({ ...form, bestSeller: v })}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                isLoading={isSaving}
                className="mt-2"
              >
                {editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
