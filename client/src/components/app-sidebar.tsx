import { Home, DollarSign, Dumbbell, UtensilsCrossed, Calendar, BookOpen } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    testId: "nav-dashboard"
  },
  {
    title: "Finanças",
    url: "/financas",
    icon: DollarSign,
    testId: "nav-financas"
  },
  {
    title: "Treinos",
    url: "/treinos",
    icon: Dumbbell,
    testId: "nav-treinos"
  },
  {
    title: "Dieta",
    url: "/dieta",
    icon: UtensilsCrossed,
    testId: "nav-dieta"
  },
  {
    title: "Agenda",
    url: "/agenda",
    icon: Calendar,
    testId: "nav-agenda"
  },
  {
    title: "Estudos",
    url: "/estudos",
    icon: BookOpen,
    testId: "nav-estudos"
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Minha Vida</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={item.testId}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
