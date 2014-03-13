package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnore;

import play.data.format.Formats;
import play.db.ebean.Model;

@Entity 
@Table(name="projects")
public class Project extends Model {
	
	@Id
    public Long id;
    
    public String name;
    public String description;
    
    @Formats.DateTime(pattern="MM/dd/yy")
    public Date create_date;
    
    @JsonIgnore
    @ManyToOne
    public User user;
    
    public static Model.Finder<Long,Project> find = new Model.Finder(Long.class, Project.class);
    
    @Override
	public void save() {
		super.save();
	}
    
    @Override
	public void update() {
		super.update();
	}
}
