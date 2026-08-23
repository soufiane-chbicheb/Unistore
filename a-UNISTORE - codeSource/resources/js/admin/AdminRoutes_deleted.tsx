import { Route, Switch } from "wouter";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminLayout } from "./components/layout/AdminLayout";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { ProductsList } from "./pages/products/ProductsList";
import { Colors } from "./pages/variants/Colors";
import { Sizes } from "./pages/variants/Sizes";
import { Materials } from "./pages/variants/Materials";
import { FitTypes } from "./pages/variants/FitTypes";
import { CategoriesList } from "./pages/categories/CategoriesList";
import { OrdersList } from "./pages/orders/OrdersList";
import { OrderDetails } from "./pages/orders/OrderDetails";
import { CustomersList } from "./pages/customers/CustomersList";
import { CustomerDetails } from "./pages/customers/CustomerDetails";
import { CouponsList } from "./pages/coupons/CouponsList";
import { InventoryOverview } from "./pages/inventory/InventoryOverview";
import { ReviewsList } from "./pages/reviews/ReviewsList";
import { SalesReport } from "./pages/reports/SalesReport";
import { ShippingManagement } from "./pages/shipping/ShippingManagement";
import { AdminsList } from "./pages/admins/AdminsList";
import { StoreSettingsPage } from "./pages/settings/StoreSettings";

export function AdminRoutes() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Switch>
          <Route path="/admin/login" component={Login} />
          <Route path="/">
            {() => (
              <AdminLayout>
                <Switch>
                  <Route path="/" component={Dashboard} />
                  <Route path="/products" component={ProductsList} />
                  <Route path="/variants/colors" component={Colors} />
                  <Route path="/variants/sizes" component={Sizes} />
                  <Route path="/variants/materials" component={Materials} />
                  <Route path="/variants/fit-types" component={FitTypes} />
                  <Route path="/categories" component={CategoriesList} />
                  <Route path="/orders/:id" component={OrderDetails} />
                  <Route path="/orders" component={OrdersList} />
                  <Route path="/customers/:id" component={CustomerDetails} />
                  <Route path="/customers" component={CustomersList} />
                  <Route path="/coupons" component={CouponsList} />
                  <Route path="/inventory" component={InventoryOverview} />
                  <Route path="/reviews" component={ReviewsList} />
                  <Route path="/reports" component={SalesReport} />
                  <Route path="/shipping" component={ShippingManagement} />
                  <Route path="/admins" component={AdminsList} />
                  <Route path="/settings" component={StoreSettingsPage} />
                  <Route>
                    <div className="flex h-screen items-center justify-center">
                      <p className="text-muted-foreground">404 - Page not found</p>
                    </div>
                  </Route>
                </Switch>
              </AdminLayout>
            )}
          </Route>
        </Switch>
      </ThemeProvider>
    </AuthProvider>
  );
}
