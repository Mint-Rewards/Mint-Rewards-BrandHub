import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, MoreHorizontal, Pencil, Trash2, Power, Loader2, Tag, Copy, Ticket, Download } from "lucide-react";
import { downloadCodes } from "@/lib/dealCodes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { CreateDealForm } from "./CreateDealForm";
import { useParams } from "react-router-dom";
import { Deal } from "@/types";
import {
  updateBrandDeal,
  deleteDeal,
  InsufficientPermissionError,
  ModuleNotSubscribedError,
} from "@/actions/brandActions";
import { toast } from "@/hooks/use-toast";
import { hasPermission } from "@/lib/brandAuth";
import {
  DealCodesInput,
  emptyDealCodesValue,
  resolveDealCodes,
  type DealCodesValue,
} from "@/components/DealCodesInput";

const editDealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "expired"]),
  discountPercentage: z.string().optional(),
  discountAmount: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  maxUses: z.string().optional(),
  minimumPurchase: z.string().optional(),
});

type EditDealFormData = z.infer<typeof editDealSchema>;

const STATUS_CONFIG = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-border" },
  expired: { label: "Expired", className: "bg-destructive/10 text-destructive border-destructive/20" },
} as const;

const DealsTab: React.FC<{
  deals: Deal[];
  onDealCreated?: () => Promise<void>;
  brandColor?: string;
}> = ({ deals, onDealCreated, brandColor = "hsl(var(--primary))" }) => {
  const { brandId } = useParams();
  // UX mirror of backend gates: create/edit/toggle need write, delete needs
  // manage. A user never sees a button that will 403; the typed error
  // handling below stays as the safety net, not the primary UX.
  const canWrite = hasPermission("consumer-reporting", "write");
  const canManage = hasPermission("consumer-reporting", "manage");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [viewingCodesDeal, setViewingCodesDeal] = useState<Deal | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [existingCodesOpen, setExistingCodesOpen] = useState(false);
  const [addCodesOpen, setAddCodesOpen] = useState(false);
  const [addCodesValue, setAddCodesValue] = useState<DealCodesValue>(emptyDealCodesValue);
  const [addCodesError, setAddCodesError] = useState<string | null>(null);

  const editForm = useForm<EditDealFormData>({
    resolver: zodResolver(editDealSchema),
    defaultValues: { title: "", description: "", status: "active" },
  });

  const copyCodes = async (codes: string[]) => {
    await navigator.clipboard.writeText(codes.join("\n"));
    toast({ title: "Copied", description: `${codes.length} codes copied to clipboard.` });
  };

  const handleDownloadCodes = (
    codes: string[],
    format: "txt" | "csv",
    dealTitle: string,
  ) => {
    downloadCodes(codes, format, dealTitle);
    toast({
      title: "Downloaded",
      description: `${codes.length} codes saved as .${format}`,
    });
  };

  const openEdit = (deal: Deal) => {
    editForm.reset({
      title: deal.title,
      description: deal.description ?? "",
      status: (deal.status as "active" | "inactive" | "expired") ?? "active",
      discountPercentage: deal.discountPercentage?.toString() ?? "",
      discountAmount: deal.discountAmount?.toString() ?? "",
      startDate: deal.startDate ?? "",
      endDate: deal.endDate ?? "",
      maxUses: deal.maxUses?.toString() ?? "",
      minimumPurchase: deal.minimumPurchase?.toString() ?? "",
    });
    setExistingCodesOpen(false);
    setAddCodesOpen(false);
    setAddCodesValue(emptyDealCodesValue);
    setAddCodesError(null);
    setEditingDeal(deal);
  };

  const handleEditSubmit = async (data: EditDealFormData) => {
    if (!editingDeal || !brandId) return;

    // "Add more codes" is optional — only include addCodes when the section is
    // open and has input; validation errors block the save so nothing is lost.
    let addCodes: string[] | { count: number; prefix?: string } | undefined;
    if (addCodesOpen && (addCodesValue.rawCodes.trim() || addCodesValue.mode === "generate")) {
      const resolved = resolveDealCodes(addCodesValue);
      if ("error" in resolved) {
        setAddCodesError(resolved.error);
        return;
      }
      addCodes = "codes" in resolved ? resolved.codes : resolved.generateCodes;
    }
    setAddCodesError(null);
    setBusyId(editingDeal.id);
    try {
      await updateBrandDeal(brandId, editingDeal.id, {
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        discountPercentage: data.discountPercentage ? parseFloat(data.discountPercentage) : null,
        discountAmount: data.discountAmount ? parseFloat(data.discountAmount) : null,
        ...(addCodes !== undefined ? { addCodes } : {}),
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        maxUses: data.maxUses ? parseInt(data.maxUses) : null,
        minimumPurchase: data.minimumPurchase ? parseFloat(data.minimumPurchase) : null,
      });
      toast({ title: "Deal updated", description: `"${data.title}" has been saved.` });
      setEditingDeal(null);
      await onDealCreated?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update deal.";
      if (addCodes !== undefined) setAddCodesError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleToggle = async (deal: Deal) => {
    if (!brandId) return;
    const newStatus = deal.status === "active" ? "inactive" : "active";
    setBusyId(deal.id);
    try {
      await updateBrandDeal(brandId, deal.id, { status: newStatus as "active" | "inactive" });
      toast({
        title: newStatus === "active" ? "Deal activated" : "Deal deactivated",
        description: `"${deal.title}" is now ${newStatus}.`,
      });
      await onDealCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update deal.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingDeal || !brandId) return;
    setBusyId(deletingDeal.id);
    try {
      await deleteDeal(brandId, deletingDeal.id);
      toast({ title: "Deal deleted", description: `"${deletingDeal.title}" has been removed.` });
      setDeletingDeal(null);
      await onDealCreated?.();
    } catch (error) {
      // 403 (role too low) and 402 (module not in plan) carry different
      // meanings — keep the copy distinct.
      toast({
        title:
          error instanceof InsufficientPermissionError
            ? "Permission required"
            : error instanceof ModuleNotSubscribedError
              ? "Not part of your plan"
              : "Error",
        description: error instanceof Error ? error.message : "Failed to delete deal.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Deals & Discounts</CardTitle>
            <CardDescription>Manage your promotional offers</CardDescription>
          </div>
          {canWrite && (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Deal
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {deals.length > 0 ? (
            <div className="divide-y divide-border">
              {deals.map((deal) => {
                const statusKey = (deal.status ?? "inactive") as keyof typeof STATUS_CONFIG;
                const config = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.inactive;
                const isBusy = busyId === deal.id;

                return (
                  <div
                    key={deal.id}
                    className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: brandColor + "1a" }}>
                        <Tag className="h-4 w-4" style={{ color: brandColor }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium leading-snug">{deal.title}</p>
                          <Badge variant="outline" className={`text-xs shrink-0 ${config.className}`}>
                            {config.label}
                          </Badge>
                        </div>
                        {deal.description && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                            {deal.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          {deal.discountPercentage != null && (
                            <span className="text-xs text-muted-foreground">
                              {deal.discountPercentage}% off
                            </span>
                          )}
                          {deal.discountAmount != null && (
                            <span className="text-xs text-muted-foreground">
                              ${deal.discountAmount} off
                            </span>
                          )}
                          {(deal.codeCount ?? deal.codes?.length ?? 0) > 0 && (
                            <span className="text-xs font-mono bg-muted text-foreground px-1.5 py-0.5 rounded">
                              {deal.codeCount ?? deal.codes?.length} {(deal.codeCount ?? deal.codes?.length) === 1 ? "code" : "codes"}
                            </span>
                          )}
                          {deal.startDate && deal.endDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(deal.startDate).toLocaleDateString()} –{" "}
                              {new Date(deal.endDate).toLocaleDateString()}
                            </span>
                          )}
                          {deal.maxUses != null && (
                            <span className="text-xs text-muted-foreground">
                              {deal.currentUses ?? 0}/{deal.maxUses} uses
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground m-2" />
                      ) : canWrite ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Actions for ${deal.title}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => openEdit(deal)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {(deal.codes?.length ?? 0) > 0 && (
                              <DropdownMenuItem onClick={() => setViewingCodesDeal(deal)}>
                                <Ticket className="h-4 w-4 mr-2" />
                                View codes
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleToggle(deal)}
                              disabled={statusKey === "expired"}
                            >
                              <Power className="h-4 w-4 mr-2" />
                              {statusKey === "active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            {canManage && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeletingDeal(deal)}
                                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Tag className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-1">No deals yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                Create your first promotional deal to attract and reward customers.
              </p>
              {canWrite && (
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Deal
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
          </DialogHeader>
          <CreateDealForm
            brandId={brandId!}
            onSuccess={async () => { setCreateOpen(false); await onDealCreated?.(); }}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editingDeal} onOpenChange={(open) => !open && setEditingDeal(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl><Input placeholder="Deal title" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount %</FormLabel>
                      <FormControl><Input type="number" placeholder="20" min="0" max="100" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="discountAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Amount ($)</FormLabel>
                      <FormControl><Input type="number" placeholder="10.00" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Uses</FormLabel>
                      <FormControl><Input type="number" placeholder="100" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your deal…" className="resize-none" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Existing codes are immutable — the backend only appends. */}
              <div className="rounded-md border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Promo codes
                    <span className="text-muted-foreground font-normal">
                      {" "}— {editingDeal?.codes?.length ?? editingDeal?.codeCount ?? 0} on this deal
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    {(editingDeal?.codes?.length ?? 0) > 0 && (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setExistingCodesOpen((open) => !open)}
                        >
                          {existingCodesOpen ? "Hide codes" : "Show codes"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCodes(editingDeal?.codes ?? [])}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy all
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownloadCodes(editingDeal?.codes ?? [], "txt", editingDeal?.title ?? "deal")
                          }
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          .txt
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownloadCodes(editingDeal?.codes ?? [], "csv", editingDeal?.title ?? "deal")
                          }
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          .csv
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {existingCodesOpen && (
                  <div className="max-h-32 overflow-y-auto rounded bg-muted/50 p-2 font-mono text-xs space-y-0.5">
                    {editingDeal?.codes?.map((code) => (
                      <div key={code}>{code}</div>
                    ))}
                  </div>
                )}
                {addCodesOpen ? (
                  <div className="space-y-2 pt-1">
                    <DealCodesInput
                      idPrefix="add-codes"
                      value={addCodesValue}
                      onChange={setAddCodesValue}
                      uploadLabel="Upload codes"
                      generateLabel="Generate codes"
                    />
                    {addCodesError && (
                      <p className="text-sm font-medium text-destructive">{addCodesError}</p>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAddCodesOpen(false);
                        setAddCodesValue(emptyDealCodesValue);
                        setAddCodesError(null);
                      }}
                    >
                      Cancel adding codes
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={() => setAddCodesOpen(true)}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add more codes
                  </Button>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingDeal(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!!busyId}>
                  {busyId === editingDeal?.id && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View codes */}
      <Dialog open={!!viewingCodesDeal} onOpenChange={(open) => !open && setViewingCodesDeal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Codes — {viewingCodesDeal?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {viewingCodesDeal?.codes?.length ?? 0} codes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCodes(viewingCodesDeal?.codes ?? [])}
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy all
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownloadCodes(viewingCodesDeal?.codes ?? [], "txt", viewingCodesDeal?.title ?? "deal")
                  }
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  .txt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownloadCodes(viewingCodesDeal?.codes ?? [], "csv", viewingCodesDeal?.title ?? "deal")
                  }
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  .csv
                </Button>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto rounded-md border bg-muted/50 p-3 font-mono text-sm space-y-1">
              {viewingCodesDeal?.codes?.map((code) => (
                <div key={code}>{code}</div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingDeal} onOpenChange={(open) => !open && setDeletingDeal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this deal?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>"{deletingDeal?.title}"</strong> will be permanently removed. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!busyId}
            >
              {busyId === deletingDeal?.id && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DealsTab;
