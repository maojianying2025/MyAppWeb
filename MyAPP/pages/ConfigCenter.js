import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Shield, Calendar, Key, UserCircle, Upload, Download, Edit3, Settings, GitBranch, CreditCard } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import RegionManager from "../components/config/RegionManager";
import OrganizationManager from "../components/config/OrganizationManager";
import RoleManager from "../components/config/RoleManager";
import ProgramManager from "../components/config/ProgramManager";
import RolePermissionManager from "../components/config/RolePermissionManager";
import CompactTaskConfig from "../components/config/CompactTaskConfig";
import CompactFlowConfig from "../components/config/CompactFlowConfig";
import ICCIDManager from "../components/config/ICCIDManager";


export default function ConfigCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Configuration Center</h1>
          <p className="text-sm text-gray-600">System configuration and permission management</p>
        </div>

        <Tabs defaultValue="region" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 mb-4 h-auto gap-1">
            <TabsTrigger value="region" className="flex items-center gap-1 py-2 px-2 text-xs">
              <Building2 className="w-3 h-3" />
              <span className="hidden sm:inline">Region</span>
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-1 py-2 px-2 text-xs">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">Org</span>
            </TabsTrigger>
            <TabsTrigger value="role" className="flex items-center gap-1 py-2 px-2 text-xs">
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">Role</span>
            </TabsTrigger>
            <TabsTrigger value="program" className="flex items-center gap-1 py-2 px-2 text-xs">
              <Calendar className="w-3 h-3" />
              <span className="hidden sm:inline">Program</span>
            </TabsTrigger>
            <TabsTrigger value="permission" className="flex items-center gap-1 py-2 px-2 text-xs">
              <Key className="w-3 h-3" />
              <span className="hidden sm:inline">Permission</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-1 py-2 px-2 text-xs">
              <Settings className="w-3 h-3" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="flows" className="flex items-center gap-1 py-2 px-2 text-xs">
              <GitBranch className="w-3 h-3" />
              <span className="hidden sm:inline">Flows</span>
            </TabsTrigger>
            </TabsList>

          <TabsContent value="region">
            <RegionManager />
          </TabsContent>

          <TabsContent value="organization">
            <OrganizationManager />
          </TabsContent>

          <TabsContent value="role">
            <RoleManager />
          </TabsContent>

          <TabsContent value="program">
            <ProgramManager />
          </TabsContent>

          <TabsContent value="permission">
            <RolePermissionManager />
          </TabsContent>

          <TabsContent value="tasks">
            <CompactTaskConfig />
          </TabsContent>

          <TabsContent value="flows">
            <CompactFlowConfig />
          </TabsContent>
        </Tabs>
        </div>
    </div>
  );
}