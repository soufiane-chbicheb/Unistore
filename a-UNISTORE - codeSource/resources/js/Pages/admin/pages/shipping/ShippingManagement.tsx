import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ShippingZone, ShippingRate, InsertShippingZone, InsertShippingRate } from "@shared/schema";
import { formatCurrency } from "../../utils/helpers";
import { useToast } from "../../hooks/useToast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export function ShippingManagement() {
  const [activeTab, setActiveTab] = useState("zones");
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editingRateId, setEditingRateId] = useState<string | null>(null);

  const [zoneName, setZoneName] = useState("");
  const [countries, setCountries] = useState("");
  const [zoneStatus, setZoneStatus] = useState<"active" | "inactive">("active");

  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [rateName, setRateName] = useState("");
  const [rate, setRate] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [rateStatus, setRateStatus] = useState<"active" | "inactive">("active");

  const { toast } = useToast();

  const { data: zones, isLoading: zonesLoading } = useQuery<ShippingZone[]>({
    queryKey: ["/api/admin/shipping/zones"],
  });

  const { data: rates, isLoading: ratesLoading } = useQuery<ShippingRate[]>({
    queryKey: ["/api/admin/shipping/rates"],
  });

  const createZoneMutation = useMutation({
    mutationFn: async (data: InsertShippingZone) => {
      await apiRequest("POST", "/api/admin/shipping/zones", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shipping/zones"] });
      toast({ title: "Shipping zone created successfully" });
      handleCloseZoneDialog();
    },
  });

  const createRateMutation = useMutation({
    mutationFn: async (data: InsertShippingRate) => {
      await apiRequest("POST", "/api/admin/shipping/rates", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shipping/rates"] });
      toast({ title: "Shipping rate created successfully" });
      handleCloseRateDialog();
    },
  });

  const handleCloseZoneDialog = () => {
    setIsZoneDialogOpen(false);
    setEditingZoneId(null);
    setZoneName("");
    setCountries("");
    setZoneStatus("active");
  };

  const handleCloseRateDialog = () => {
    setIsRateDialogOpen(false);
    setEditingRateId(null);
    setSelectedZoneId("");
    setRateName("");
    setRate("");
    setMinOrder("");
    setRateStatus("active");
  };

  const handleZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: zoneName, countries, status: zoneStatus };
    createZoneMutation.mutate(data);
  };

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const zone = zones?.find(z => z.id === selectedZoneId);
    if (!zone) return;

    const data: InsertShippingRate = {
      zoneId: selectedZoneId,
      zoneName: zone.name,
      name: rateName,
      rate,
      minOrder: minOrder || null,
      status: rateStatus,
    };
    createRateMutation.mutate(data);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">
          Shipping Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure shipping zones and rates
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="zones">Shipping Zones</TabsTrigger>
          <TabsTrigger value="rates">Shipping Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="zones">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Shipping Zones</CardTitle>
              <Button onClick={() => setIsZoneDialogOpen(true)} data-testid="button-add-zone">
                <Plus className="mr-2 h-4 w-4" />
                Add Zone
              </Button>
            </CardHeader>
            <CardContent>
              {zonesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : zones && zones.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone Name</TableHead>
                      <TableHead>Countries</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zones.map((zone) => (
                      <TableRow key={zone.id} data-testid={`row-zone-${zone.id}`}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell className="text-muted-foreground">{zone.countries}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              zone.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }
                          >
                            {zone.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No shipping zones yet. Create your first zone.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Shipping Rates</CardTitle>
              <Button onClick={() => setIsRateDialogOpen(true)} data-testid="button-add-rate">
                <Plus className="mr-2 h-4 w-4" />
                Add Rate
              </Button>
            </CardHeader>
            <CardContent>
              {ratesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : rates && rates.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rate Name</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Min Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rates.map((shippingRate) => (
                      <TableRow key={shippingRate.id} data-testid={`row-rate-${shippingRate.id}`}>
                        <TableCell className="font-medium">{shippingRate.name}</TableCell>
                        <TableCell>{shippingRate.zoneName}</TableCell>
                        <TableCell>{formatCurrency(shippingRate.rate)}</TableCell>
                        <TableCell>
                          {shippingRate.minOrder ? formatCurrency(shippingRate.minOrder) : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              shippingRate.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }
                          >
                            {shippingRate.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No shipping rates yet. Create your first rate.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Shipping Zone</DialogTitle>
            <DialogDescription>Add a new shipping zone</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleZoneSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="zoneName">Zone Name</Label>
                <Input
                  id="zoneName"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="e.g., North America"
                  required
                  data-testid="input-zone-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="countries">Countries</Label>
                <Input
                  id="countries"
                  value={countries}
                  onChange={(e) => setCountries(e.target.value)}
                  placeholder="e.g., United States, Canada, Mexico"
                  required
                  data-testid="input-countries"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zoneStatus">Status</Label>
                <Select value={zoneStatus} onValueChange={(v: "active" | "inactive") => setZoneStatus(v)}>
                  <SelectTrigger data-testid="select-zone-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseZoneDialog}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Shipping Rate</DialogTitle>
            <DialogDescription>Add a new shipping rate</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRateSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="zone">Shipping Zone</Label>
                <Select value={selectedZoneId} onValueChange={setSelectedZoneId} required>
                  <SelectTrigger data-testid="select-zone">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones?.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rateName">Rate Name</Label>
                <Input
                  id="rateName"
                  value={rateName}
                  onChange={(e) => setRateName(e.target.value)}
                  placeholder="e.g., Standard Shipping"
                  required
                  data-testid="input-rate-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Rate ($)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="10.00"
                  step="0.01"
                  required
                  data-testid="input-rate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrder">Minimum Order ($)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="0.00 (optional)"
                  step="0.01"
                  data-testid="input-min-order"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rateStatus">Status</Label>
                <Select value={rateStatus} onValueChange={(v: "active" | "inactive") => setRateStatus(v)}>
                  <SelectTrigger data-testid="select-rate-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseRateDialog}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
