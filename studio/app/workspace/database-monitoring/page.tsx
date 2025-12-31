"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Database,
  Plus,
  TestTube,
  Trash2,
  Edit,
  Eye,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  Table as TableIcon,
  Columns,
  FileText,
  Play,
  Loader2,
} from "lucide-react";
import { applyTheme } from "@/lib/theme";
import axios from "axios";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

interface DatabaseConnection {
  id: number;
  name: string;
  engine: string;
  host: string;
  port: number;
  database: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

interface TableInfo {
  name: string;
  type: string;
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
}

export default function DatabaseMonitoringPage() {
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null);
  const [schemas, setSchemas] = useState<string[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [queryColumns, setQueryColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<DatabaseConnection | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    engine: "postgresql",
    host: "",
    port: 5432,
    database: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (selectedConnection) {
      fetchSchemas();
    }
  }, [selectedConnection]);

  useEffect(() => {
    if (selectedConnection) {
      fetchTables();
    }
  }, [selectedConnection, selectedSchema]);

  useEffect(() => {
    if (selectedConnection && selectedTable) {
      fetchColumns();
      fetchTablePreview();
    }
  }, [selectedConnection, selectedTable, selectedSchema]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/admin/databases/`, {
        headers: getAuthHeaders(),
      });
      setConnections(response.data);
    } catch (error: any) {
      toast.error("Failed to fetch connections: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchSchemas = async () => {
    if (!selectedConnection) return;
    try {
      const response = await axios.get(
        `${API_BASE}/api/admin/databases/${selectedConnection}/schemas/`,
        { headers: getAuthHeaders() }
      );
      setSchemas(response.data.schemas || []);
    } catch (error: any) {
      console.error("Failed to fetch schemas:", error);
    }
  };

  const fetchTables = async () => {
    if (!selectedConnection) return;
    try {
      const url = selectedSchema
        ? `${API_BASE}/api/admin/databases/${selectedConnection}/tables/?schema=${selectedSchema}`
        : `${API_BASE}/api/admin/databases/${selectedConnection}/tables/`;
      const response = await axios.get(url, { headers: getAuthHeaders() });
      setTables(response.data.tables || []);
    } catch (error: any) {
      console.error("Failed to fetch tables:", error);
    }
  };

  const fetchColumns = async () => {
    if (!selectedConnection || !selectedTable) return;
    try {
      const url = selectedSchema
        ? `${API_BASE}/api/admin/databases/${selectedConnection}/tables/${selectedTable}/columns/?schema=${selectedSchema}`
        : `${API_BASE}/api/admin/databases/${selectedConnection}/tables/${selectedTable}/columns/`;
      const response = await axios.get(url, { headers: getAuthHeaders() });
      setColumns(response.data.columns || []);
    } catch (error: any) {
      console.error("Failed to fetch columns:", error);
    }
  };

  const fetchTablePreview = async () => {
    if (!selectedConnection || !selectedTable) return;
    try {
      const url = selectedSchema
        ? `${API_BASE}/api/admin/databases/${selectedConnection}/tables/${selectedTable}/preview/?schema=${selectedSchema}&limit=100`
        : `${API_BASE}/api/admin/databases/${selectedConnection}/tables/${selectedTable}/preview/?limit=100`;
      const response = await axios.get(url, { headers: getAuthHeaders() });
      setTableData(response.data.rows || []);
      setTableColumns(response.data.columns || []);
    } catch (error: any) {
      console.error("Failed to fetch table preview:", error);
    }
  };

  const testConnection = async (id: number) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/admin/databases/${id}/test/`,
        {},
        { headers: getAuthHeaders() }
      );
      if (response.data.success) {
        toast.success("Connection test successful!");
      } else {
        toast.error("Connection test failed: " + response.data.message);
      }
    } catch (error: any) {
      toast.error("Connection test failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSaveConnection = async () => {
    try {
      setLoading(true);
      if (editingConnection) {
        await axios.put(
          `${API_BASE}/api/admin/databases/${editingConnection.id}/`,
          formData,
          { headers: getAuthHeaders() }
        );
        toast.success("Connection updated successfully!");
      } else {
        await axios.post(
          `${API_BASE}/api/admin/databases/`,
          formData,
          { headers: getAuthHeaders() }
        );
        toast.success("Connection created successfully!");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchConnections();
    } catch (error: any) {
      console.error("Error saving connection:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.message ||
                          "Unknown error occurred";
      toast.error(`Failed to save connection: ${errorMessage}`);
      if (error.response?.data) {
        console.error("Server error details:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConnection = async (id: number) => {
    if (!confirm("Are you sure you want to delete this connection?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/databases/${id}/`, {
        headers: getAuthHeaders(),
      });
      toast.success("Connection deleted successfully!");
      fetchConnections();
      if (selectedConnection === id) {
        setSelectedConnection(null);
      }
    } catch (error: any) {
      toast.error("Failed to delete connection: " + (error.response?.data?.detail || error.message));
    }
  };

  const handleExecuteQuery = async () => {
    if (!selectedConnection || !query.trim()) {
      toast.error("Please select a connection and enter a query");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/api/admin/databases/${selectedConnection}/query/`,
        { query: query.trim() },
        { headers: getAuthHeaders() }
      );
      setQueryResults(response.data.rows || []);
      setQueryColumns(response.data.columns || []);
      toast.success(`Query executed successfully. ${response.data.count} rows returned.`);
    } catch (error: any) {
      toast.error("Query execution failed: " + (error.response?.data?.error || error.message));
      setQueryResults([]);
      setQueryColumns([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      engine: "postgresql",
      host: "",
      port: 5432,
      database: "",
      username: "",
      password: "",
    });
    setEditingConnection(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (connection: DatabaseConnection) => {
    setEditingConnection(connection);
    setFormData({
      name: connection.name,
      engine: connection.engine,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      username: connection.username,
      password: "", // Don't populate password
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h2-dynamic font-bold">Database Monitoring</h1>
        <p className="text-muted-foreground mt-1">Manage database connections, browse schemas, and execute queries</p>
      </div>

      <div className="flex items-center justify-end">
        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Connection
        </Button>
      </div>

      <Tabs defaultValue="connections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="browser">Database Browser</TabsTrigger>
          <TabsTrigger value="query">Query Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          <Card className={applyTheme.card()}>
            <CardHeader>
              <CardTitle>Database Connections</CardTitle>
              <CardDescription>Manage your database connections</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && connections.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-palette-primary" />
                </div>
              ) : connections.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className={applyTheme.text('secondary')}>No database connections found</p>
                  <Button onClick={openCreateDialog} className="mt-4">
                    Create First Connection
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Engine</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Database</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connections.map((conn) => (
                      <TableRow key={conn.id}>
                        <TableCell className="font-medium">{conn.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{conn.engine}</Badge>
                        </TableCell>
                        <TableCell>{conn.host}:{conn.port}</TableCell>
                        <TableCell>{conn.database}</TableCell>
                        <TableCell>
                          {conn.is_active ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedConnection(conn.id);
                                // Switch to browser tab
                                document.querySelector('[value="browser"]')?.click();
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => testConnection(conn.id)}
                            >
                              <TestTube className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(conn)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConnection(conn.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browser">
          <div className="space-y-6">
            <Card className={applyTheme.card()}>
              <CardHeader>
                <CardTitle>Select Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedConnection?.toString() || ""}
                  onValueChange={(value) => setSelectedConnection(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a database connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((conn) => (
                      <SelectItem key={conn.id} value={conn.id.toString()}>
                        {conn.name} ({conn.engine})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedConnection && (
              <>
                {schemas.length > 0 && (
                  <Card className={applyTheme.card()}>
                    <CardHeader>
                      <CardTitle>Schema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={selectedSchema || "__all__"}
                        onValueChange={(value) => setSelectedSchema(value === "__all__" ? null : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a schema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">All Schemas</SelectItem>
                          {schemas.map((schema) => (
                            <SelectItem key={schema} value={schema}>
                              {schema}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}

                <Card className={applyTheme.card()}>
                  <CardHeader>
                    <CardTitle>Tables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tables.length === 0 ? (
                      <p className={applyTheme.text('secondary')}>No tables found</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tables.map((table) => (
                          <Button
                            key={table.name}
                            variant={selectedTable === table.name ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => setSelectedTable(table.name)}
                          >
                            <TableIcon className="h-4 w-4 mr-2" />
                            {table.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedTable && (
                  <>
                    <Card className={applyTheme.card()}>
                      <CardHeader>
                        <CardTitle>Columns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Nullable</TableHead>
                              <TableHead>Default</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {columns.map((col) => (
                              <TableRow key={col.name}>
                                <TableCell className="font-medium">{col.name}</TableCell>
                                <TableCell>{col.type}</TableCell>
                                <TableCell>
                                  {col.nullable ? (
                                    <Badge variant="outline">Yes</Badge>
                                  ) : (
                                    <Badge className="bg-red-100 text-red-800">No</Badge>
                                  )}
                                </TableCell>
                                <TableCell>{col.default || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card className={applyTheme.card()}>
                      <CardHeader>
                        <CardTitle>Table Preview</CardTitle>
                        <CardDescription>First 100 rows</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {tableData.length === 0 ? (
                          <p className={applyTheme.text('secondary')}>No data available</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {tableColumns.map((col) => (
                                    <TableHead key={col}>{col}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tableData.map((row, idx) => (
                                  <TableRow key={idx}>
                                    {tableColumns.map((col) => (
                                      <TableCell key={col}>
                                        {row[col] !== null && row[col] !== undefined
                                          ? String(row[col])
                                          : "NULL"}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="query">
          <div className="space-y-6">
            <Card className={applyTheme.card()}>
              <CardHeader>
                <CardTitle>Query Editor</CardTitle>
                <CardDescription>Execute read-only SQL queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Connection</Label>
                  <Select
                    value={selectedConnection?.toString() || ""}
                    onValueChange={(value) => setSelectedConnection(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a database connection" />
                    </SelectTrigger>
                    <SelectContent>
                      {connections.map((conn) => (
                        <SelectItem key={conn.id} value={conn.id.toString()}>
                          {conn.name} ({conn.engine})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>SQL Query</Label>
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SELECT * FROM table_name LIMIT 100;"
                    className="font-mono"
                    rows={10}
                  />
                </div>
                <Button
                  onClick={handleExecuteQuery}
                  disabled={!selectedConnection || !query.trim() || loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Execute Query
                </Button>
              </CardContent>
            </Card>

            {queryResults.length > 0 && (
              <Card className={applyTheme.card()}>
                <CardHeader>
                  <CardTitle>Query Results</CardTitle>
                  <CardDescription>{queryResults.length} rows returned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {queryColumns.map((col) => (
                            <TableHead key={col}>{col}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {queryResults.map((row, idx) => (
                          <TableRow key={idx}>
                            {queryColumns.map((col) => (
                              <TableCell key={col}>
                                {row[col] !== null && row[col] !== undefined
                                  ? String(row[col])
                                  : "NULL"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Connection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingConnection ? "Edit Connection" : "New Connection"}
            </DialogTitle>
            <DialogDescription>
              {editingConnection
                ? "Update database connection details"
                : "Create a new database connection"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Connection Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Database"
              />
            </div>
            <div>
              <Label htmlFor="engine">Database Engine</Label>
              <Select
                value={formData.engine}
                onValueChange={(value) => setFormData({ ...formData, engine: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  placeholder="localhost"
                />
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 5432 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                value={formData.database}
                onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                placeholder="mydb"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="user"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingConnection ? "Leave blank to keep current password" : "password"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConnection} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

